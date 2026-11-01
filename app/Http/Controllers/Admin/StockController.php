<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdjustStockRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\StockService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    /**
     * Display stock balances and ledger history.
     */
    public function index(Request $request): Response
    {
        $productsQuery = Product::with('category')->orderBy('name');

        if ($request->boolean('low_stock')) {
            $productsQuery->whereColumn('stock', '<=', 'low_stock_threshold');
        }

        if ($search = $request->input('search')) {
            $productsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $productsQuery->get()->map(fn (Product $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'sku' => $p->sku,
            'stock' => $p->stock,
            'low_stock_threshold' => $p->low_stock_threshold,
            'category_name' => $p->category->name ?? 'Unassigned',
            'is_low_stock' => $p->stock <= $p->low_stock_threshold,
        ]);

        $movements = StockMovement::with(['product', 'user'])
            ->orderByDesc('id')
            ->take(50)
            ->get()
            ->map(fn (StockMovement $m) => [
                'id' => $m->id,
                'product_id' => $m->product_id,
                'product_name' => $m->product->name ?? 'Deleted Product',
                'sku' => $m->product->sku ?? '—',
                'type' => $m->type->value,
                'delta' => $m->quantity_delta,
                'reason' => $m->reason ?? '—',
                'actor' => $m->user->name ?? 'System',
                'created_at' => $m->created_at?->format('M d, Y H:i') ?? '—',
            ]);

        return Inertia::render('admin/stock/index', [
            'products' => $products,
            'movements' => $movements,
            'filters' => $request->only(['search', 'low_stock']),
        ]);
    }

    /**
     * Adjust stock for a product.
     */
    public function store(AdjustStockRequest $request, Product $product, StockService $stockService): RedirectResponse
    {
        $delta = $request->integer('delta');
        $reason = $request->string('reason')->toString();

        try {
            $stockService->adjust($product, $delta, $reason, $request->user());
        } catch (InsufficientStockException $e) {
            throw ValidationException::withMessages([
                'delta' => $e->getMessage(),
            ]);
        }

        return back()->with('status', 'Stock adjusted successfully.');
    }
}

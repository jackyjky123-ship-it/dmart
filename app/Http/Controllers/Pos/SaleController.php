<?php

namespace App\Http\Controllers\Pos;

use App\Enums\OrderChannel;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Services\StockService;
use App\Support\OrderPresenter;
use App\Support\StorefrontProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    /**
     * Display the POS register with the real active catalog.
     */
    public function index(Request $request): Response
    {
        $categories = Category::query()
            ->withCount(['products' => fn (Builder $query) => $query->where('is_active', true)])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'product_count' => $category->products_count,
            ])
            ->all();

        $products = Product::query()
            ->active()
            ->with(['category', 'primaryImage'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (Product $product): array => StorefrontProduct::toCard($product))
            ->all();

        return Inertia::render('pos/index', [
            'products' => $products,
            'categories' => $categories,
            'cashier' => [
                'name' => $request->user()->name,
            ],
        ]);
    }

    /**
     * Persist a completed counter sale and its payment.
     */
    public function store(Request $request, StockService $stockService): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_id' => ['required', 'integer', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'payment_method' => ['required', Rule::enum(PaymentMethod::class)],
            'cash_tendered_cents' => ['nullable', 'integer', 'min:0'],
            'customer_name' => ['nullable', 'string', 'max:255'],
        ]);

        $requestedItems = collect($validated['items']);
        $productIds = $requestedItems->pluck('product_id')->unique();

        $products = Product::query()
            ->active()
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        if ($products->count() !== $productIds->count()) {
            throw ValidationException::withMessages([
                'items' => 'One or more products are no longer available.',
            ]);
        }

        $lineItems = $requestedItems->map(function (array $item) use ($products): array {
            $product = $products->get($item['product_id']);
            $quantity = (int) $item['quantity'];

            if ($quantity > $product->stock) {
                throw ValidationException::withMessages([
                    'items' => "Only {$product->stock} unit(s) of {$product->name} are available.",
                ]);
            }

            return [
                'product' => $product,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'unit_price_cents' => $product->price_cents,
                'quantity' => $quantity,
                'line_total_cents' => $product->price_cents * $quantity,
            ];
        });

        $subtotalCents = (int) $lineItems->sum('line_total_cents');
        $totalCents = $subtotalCents;
        $paymentMethod = PaymentMethod::from($validated['payment_method']);
        $cashTenderedCents = null;
        $changeCents = null;

        if ($paymentMethod === PaymentMethod::Cash) {
            $cashTenderedCents = array_key_exists('cash_tendered_cents', $validated)
                ? (int) $validated['cash_tendered_cents']
                : $totalCents;

            if ($cashTenderedCents < $totalCents) {
                throw ValidationException::withMessages([
                    'cash_tendered_cents' => 'Cash tendered must cover the sale total.',
                ]);
            }

            $changeCents = $cashTenderedCents - $totalCents;
        }

        try {
            $order = DB::transaction(function () use (
                $request,
                $validated,
                $lineItems,
                $subtotalCents,
                $totalCents,
                $paymentMethod,
                $cashTenderedCents,
                $changeCents,
                $stockService
            ): Order {
                $order = Order::create([
                    'order_number' => $this->generateOrderNumber(),
                    'user_id' => null,
                    'channel' => OrderChannel::Pos,
                    'status' => OrderStatus::Completed,
                    'payment_method' => $paymentMethod,
                    'cashier_id' => $request->user()->id,
                    'subtotal_cents' => $subtotalCents,
                    'shipping_fee_cents' => 0,
                    'total_cents' => $totalCents,
                    'cash_tendered_cents' => $cashTenderedCents,
                    'change_cents' => $changeCents,
                    'shipping_name' => $validated['customer_name'] ?: null,
                    'paid_at' => now(),
                    'delivered_at' => now(),
                ]);

                foreach ($lineItems as $lineItem) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $lineItem['product_id'],
                        'product_name' => $lineItem['product_name'],
                        'product_sku' => $lineItem['product_sku'],
                        'unit_price_cents' => $lineItem['unit_price_cents'],
                        'quantity' => $lineItem['quantity'],
                        'line_total_cents' => $lineItem['line_total_cents'],
                    ]);

                    $stockService->decrement(
                        $lineItem['product'],
                        $lineItem['quantity'],
                        StockMovementType::Sale,
                        [
                            'order_id' => $order->id,
                            'user_id' => $request->user()->id,
                            'reason' => 'POS sale',
                        ]
                    );
                }

                Payment::create([
                    'order_id' => $order->id,
                    'provider' => $paymentMethod === PaymentMethod::Cash ? 'pos_cash' : 'demo_khqr',
                    'method' => $paymentMethod,
                    'reference' => 'POS-'.Str::uuid(),
                    'amount_cents' => $totalCents,
                    'status' => PaymentStatus::Paid,
                    'payload' => [
                        'simulated' => true,
                        'cashier_id' => $request->user()->id,
                    ],
                    'paid_at' => now(),
                ]);

                return $order;
            });
        } catch (InsufficientStockException $exception) {
            throw ValidationException::withMessages([
                'items' => $exception->getMessage(),
            ]);
        }

        $order->load(['items', 'cashier']);

        Inertia::flash('receipt', [
            'order_number' => $order->order_number,
            'created_at' => $order->created_at?->format('M d, Y H:i'),
            'cashier_name' => $order->cashier?->name,
            'customer_name' => $order->shipping_name ?? 'Walk-in customer',
            'payment_method' => $paymentMethod->value,
            'items' => $order->items
                ->map(fn (OrderItem $item): array => OrderPresenter::item($item))
                ->values()
                ->all(),
            'subtotal_cents' => $order->subtotal_cents,
            'total_cents' => $order->total_cents,
            'cash_tendered_cents' => $order->cash_tendered_cents,
            'change_cents' => $order->change_cents,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Sale {$order->order_number} completed.",
        ]);

        return redirect()->route('pos.index');
    }

    /**
     * Display completed POS sales with their receipts.
     */
    public function sales(): Response
    {
        $sales = Order::query()
            ->where('channel', OrderChannel::Pos)
            ->with(['items', 'cashier', 'payments'])
            ->latest()
            ->get()
            ->map(fn (Order $order): array => [
                ...OrderPresenter::summary($order),
                'cashier_name' => $order->cashier?->name,
            ])
            ->all();

        return Inertia::render('pos/sales/index', [
            'sales' => $sales,
        ]);
    }

    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'DM-POS-'.now()->format('ymd').'-'.Str::upper(Str::random(5));
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}

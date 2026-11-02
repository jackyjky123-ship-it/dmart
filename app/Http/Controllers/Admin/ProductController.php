<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StockMovementType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\StockService;
use App\Support\Money;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'primaryImage']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->boolean('low_stock')) {
            $query->whereColumn('stock', '<=', 'low_stock_threshold');
        }

        $products = $query->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'category_id' => $product->category_id,
                'category_name' => $product->category->name ?? '',
                'price_cents' => $product->price_cents,
                'compare_at_price_cents' => $product->compare_at_price_cents,
                'stock' => $product->stock,
                'low_stock_threshold' => $product->low_stock_threshold,
                'is_active' => $product->is_active,
                'image_url' => $product->primaryImage?->url,
            ]);

        $categories = Category::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id', 'is_active', 'low_stock']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request, StockService $stockService): RedirectResponse
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $validated['slug'] = $this->generateUniqueSlug($validated['name']);
        }

        $priceCents = Money::parse((string) $validated['price']);
        $compareAtCents = ! empty($validated['compare_at_price'])
            ? Money::parse((string) $validated['compare_at_price'])
            : null;

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'sku' => $validated['sku'],
            'description' => $validated['description'] ?? '',
            'price_cents' => $priceCents,
            'compare_at_price_cents' => $compareAtCents,
            'stock' => 0,
            'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $initialStock = (int) ($validated['initial_stock'] ?? 0);
        if ($initialStock > 0) {
            $stockService->increment($product, $initialStock, StockMovementType::Restock, [
                'reason' => 'Initial inventory',
                'user_id' => $request->user()?->id,
            ]);
        }

        if ($request->hasFile('images')) {
            /** @var UploadedFile[] $files */
            $files = $request->file('images');
            $isFirst = true;

            foreach ($files as $index => $file) {
                $path = $file->store("products/{$product->id}", 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'alt' => $product->name,
                    'is_primary' => $isFirst,
                    'sort_order' => $index,
                ]);

                $isFirst = false;
            }
        }

        return redirect()->route('admin.products.index')
            ->with('status', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->load(['category', 'images']);
        $categories = Category::orderBy('name')->get(['id', 'name', 'slug']);

        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'category_id' => $product->category_id,
            'description' => $product->description,
            'price' => number_format($product->price_cents / 100, 2, '.', ''),
            'compare_at_price' => $product->compare_at_price_cents !== null
                ? number_format($product->compare_at_price_cents / 100, 2, '.', '')
                : '',
            'stock' => $product->stock,
            'low_stock_threshold' => $product->low_stock_threshold,
            'is_active' => $product->is_active,
            'images' => $product->images->map(fn (ProductImage $img) => [
                'id' => $img->id,
                'path' => $img->path,
                'url' => $img->url,
                'is_primary' => $img->is_primary,
                'sort_order' => $img->sort_order,
            ]),
        ];

        return Inertia::render('admin/products/edit', [
            'product' => $productData,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $validated['slug'] = $this->generateUniqueSlug($validated['name'], $product->id);
        }

        $priceCents = Money::parse((string) $validated['price']);
        $compareAtCents = ! empty($validated['compare_at_price'])
            ? Money::parse((string) $validated['compare_at_price'])
            : null;

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'sku' => $validated['sku'],
            'description' => $validated['description'] ?? '',
            'price_cents' => $priceCents,
            'compare_at_price_cents' => $compareAtCents,
            'low_stock_threshold' => $validated['low_stock_threshold'] ?? $product->low_stock_threshold,
            'is_active' => $validated['is_active'] ?? $product->is_active,
        ]);

        return redirect()->route('admin.products.index')
            ->with('status', 'Product updated successfully.');
    }

    /**
     * Remove the specified product (soft delete).
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('status', 'Product deleted successfully.');
    }

    /**
     * Build a unique product slug, including soft-deleted products.
     */
    private function generateUniqueSlug(string $name, ?int $ignoreProductId = null): string
    {
        $baseSlug = Str::slug($name) ?: 'product';
        $slug = $baseSlug;
        $counter = 1;

        while (Product::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreProductId, fn ($query) => $query->whereKeyNot($ignoreProductId))
            ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}

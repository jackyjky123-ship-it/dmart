<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\StorefrontProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display the filterable product catalog.
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
            ]);

        $products = Product::query()
            ->active()
            ->with(['category', 'primaryImage'])
            ->when($request->string('search')->trim()->toString(), function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($request->string('category')->trim()->toString(), function (Builder $query, string $category): void {
                $query->whereHas('category', fn (Builder $query) => $query->where('slug', $category));
            })
            ->orderByDesc('id')
            ->get()
            ->map(fn (Product $product): array => StorefrontProduct::toCard($product))
            ->all();

        return Inertia::render('storefront/products/index', [
            'products' => $products,
            'categories' => $categories,
            'initialCategory' => $request->string('category')->trim()->toString() ?: 'all',
            'initialSearch' => $request->string('search')->trim()->toString(),
        ]);
    }

    /**
     * Display a single active product.
     */
    public function show(string $slug): Response
    {
        $product = Product::query()
            ->active()
            ->with(['category', 'primaryImage', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedProducts = Product::query()
            ->active()
            ->with(['category', 'primaryImage'])
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->orderByDesc('id')
            ->take(4)
            ->get();

        if ($relatedProducts->count() < 4) {
            $excludedIds = $relatedProducts->pluck('id')->push($product->id);

            $relatedProducts = $relatedProducts->concat(
                Product::query()
                    ->active()
                    ->with(['category', 'primaryImage'])
                    ->whereNotIn('id', $excludedIds)
                    ->orderByDesc('id')
                    ->take(4 - $relatedProducts->count())
                    ->get()
            );
        }

        return Inertia::render('storefront/products/show', [
            'product' => StorefrontProduct::toDetail($product),
            'relatedProducts' => $relatedProducts
                ->map(fn (Product $related): array => StorefrontProduct::toCard($related))
                ->values()
                ->all(),
        ]);
    }
}

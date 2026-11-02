<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\StorefrontProduct;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the storefront home page.
     */
    public function index(): Response
    {
        $categories = Category::query()
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description ?? '',
                'product_count' => $category->products_count,
            ]);

        $featuredProducts = Product::query()
            ->active()
            ->with(['category', 'primaryImage'])
            ->orderByDesc('id')
            ->take(8)
            ->get()
            ->map(fn (Product $product): array => StorefrontProduct::toCard($product))
            ->all();

        return Inertia::render('storefront/home', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}

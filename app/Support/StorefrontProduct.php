<?php

namespace App\Support;

use App\Models\Product;
use App\Models\ProductImage;

final class StorefrontProduct
{
    /**
     * Shape a product for storefront cards and cart entries.
     *
     * @return array<string, mixed>
     */
    public static function toCard(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'price_cents' => $product->price_cents,
            'compare_at_price_cents' => $product->compare_at_price_cents,
            'stock' => $product->stock,
            'unit' => $product->category?->name ?? 'Apparel',
            'category_name' => $product->category?->name ?? 'Apparel',
            'category_slug' => $product->category?->slug ?? '',
            'image_url' => $product->primaryImage?->url,
        ];
    }

    /**
     * Shape a product for the detail page, including its gallery.
     *
     * @return array<string, mixed>
     */
    public static function toDetail(Product $product): array
    {
        return [
            ...self::toCard($product),
            'description' => $product->description,
            'images' => $product->images
                ->map(fn (ProductImage $image): array => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'alt' => $image->alt ?? $product->name,
                    'is_primary' => $image->is_primary,
                ])
                ->values()
                ->all(),
        ];
    }
}

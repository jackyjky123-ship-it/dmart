<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoCatalogSeeder extends Seeder
{
    /**
     * Seed a small, realistic streetwear catalog for the demo storefront.
     */
    public function run(): void
    {
        $categories = [
            'hoodies' => [
                'name' => 'Hoodies & Fleece',
                'description' => 'Heavyweight fleece with drop shoulders and a boxy streetwear cut.',
            ],
            'tees' => [
                'name' => 'Graphic Tees',
                'description' => 'Acid-wash and garment-dyed tees built for everyday wear.',
            ],
            'outerwear' => [
                'name' => 'Outerwear',
                'description' => 'Technical bombers, overshirts, and utility layers.',
            ],
            'bottoms' => [
                'name' => 'Bottoms & Cargo',
                'description' => 'Wide-leg cargos, relaxed denim, and everyday utility pants.',
            ],
            'accessories' => [
                'name' => 'Accessories',
                'description' => 'Caps, cross-body bags, and small hardware pieces.',
            ],
        ];

        $categoryModels = collect($categories)->mapWithKeys(function (array $attributes, string $slug): array {
            return [$slug => Category::updateOrCreate(['slug' => $slug], $attributes)];
        });

        $products = [
            [
                'category' => 'hoodies',
                'name' => 'Essential Oversized Hoodie',
                'sku' => 'HD-ESS-01',
                'price_cents' => 5999,
                'compare_at_price_cents' => 8999,
                'stock' => 24,
                'description' => 'A heavyweight cotton fleece hoodie with dropped shoulders, a double-lined hood, and a relaxed boxy fit. Pre-shrunk to hold its shape after washing.',
                'images' => [
                    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'hoodies',
                'name' => 'Los Angeles California Pullover',
                'sku' => 'HD-LAC-02',
                'price_cents' => 4500,
                'compare_at_price_cents' => 6700,
                'stock' => 18,
                'description' => 'A soft brushed-fleece pullover with a vintage California print. Cut with a roomy body and ribbed cuffs for an easy everyday layer.',
                'images' => [
                    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'hoodies',
                'name' => 'Smile Planet Cosmic Pullover',
                'sku' => 'HD-SMI-03',
                'price_cents' => 4500,
                'compare_at_price_cents' => 6700,
                'stock' => 15,
                'description' => 'Cosmic print pullover in a mid-weight fleece. Finished with a wide ribbed hem and a relaxed, slightly cropped silhouette.',
                'images' => [
                    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'hoodies',
                'name' => 'Armour House Strengthwear Hoodie',
                'sku' => 'HD-ARM-04',
                'price_cents' => 5600,
                'compare_at_price_cents' => 6700,
                'stock' => 22,
                'description' => 'Strengthwear hoodie with a dense hand-feel, reinforced seams, and a structured hood. Built for repeat wear and a layered fit.',
                'images' => [
                    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'tees',
                'name' => 'Acid Wash Vintage Boxy Tee',
                'sku' => 'TEE-ACD-06',
                'price_cents' => 3400,
                'compare_at_price_cents' => 4800,
                'stock' => 35,
                'description' => 'Garment-dyed cotton tee with an acid-wash finish and a boxy vintage cut. Each piece has a slightly different wash pattern.',
                'images' => [
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'tees',
                'name' => 'Monochrome Logo Tee',
                'sku' => 'TEE-MON-07',
                'price_cents' => 2900,
                'compare_at_price_cents' => null,
                'stock' => 0,
                'description' => 'Mid-weight cotton jersey tee with a small monochrome chest logo. A clean staple with a straight hem and relaxed shoulders.',
                'images' => [
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'outerwear',
                'name' => 'Monochrome Tech Flight Bomber',
                'sku' => 'OUT-BMB-08',
                'price_cents' => 12000,
                'compare_at_price_cents' => 15000,
                'stock' => 6,
                'description' => 'Technical flight bomber with a matte shell, ribbed trims, and a lightweight insulated lining. Cut slightly short for a modern silhouette.',
                'images' => [
                    'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'outerwear',
                'name' => 'Shadow Utility Overshirt',
                'sku' => 'OUT-OVR-09',
                'price_cents' => 8900,
                'compare_at_price_cents' => null,
                'stock' => 12,
                'description' => 'A structured overshirt with oversized chest pockets and a concealed snap placket. Works as a light jacket or a layered shirt.',
            ],
            [
                'category' => 'bottoms',
                'name' => 'Utility Multi-Pocket Cargo Pant',
                'sku' => 'BOT-CRG-10',
                'price_cents' => 6800,
                'compare_at_price_cents' => 8500,
                'stock' => 8,
                'description' => 'Relaxed cargo pant in a durable ripstop cotton blend. Bellowed side pockets, adjustable hems, and a comfortable mid-rise waist.',
                'images' => [
                    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'category' => 'bottoms',
                'name' => 'Relaxed Selvedge Denim',
                'sku' => 'BOT-DNM-11',
                'price_cents' => 9500,
                'compare_at_price_cents' => null,
                'stock' => 14,
                'description' => 'Straight-leg selvedge denim with a relaxed rise and a clean five-pocket construction. Rigid at first, softening with wear.',
            ],
            [
                'category' => 'accessories',
                'name' => 'Industrial Crossbody Bag',
                'sku' => 'ACC-BAG-12',
                'price_cents' => 3900,
                'compare_at_price_cents' => null,
                'stock' => 20,
                'description' => 'Compact crossbody bag in a water-resistant nylon shell. Main zip compartment, front slip pocket, and an adjustable webbing strap.',
            ],
            [
                'category' => 'accessories',
                'name' => 'Embroidered Logo Cap',
                'sku' => 'ACC-CAP-13',
                'price_cents' => 2500,
                'compare_at_price_cents' => null,
                'stock' => 3,
                'description' => 'Six-panel cotton cap with a curved brim and tonal embroidered logo. Finished with an adjustable metal clasp.',
            ],
        ];

        foreach ($products as $attributes) {
            $category = $categoryModels[$attributes['category']];
            $images = $attributes['images'] ?? [];

            unset($attributes['category'], $attributes['images']);

            $product = Product::updateOrCreate(
                ['sku' => $attributes['sku']],
                [
                    ...$attributes,
                    'slug' => Str::slug($attributes['name']),
                    'category_id' => $category->id,
                    'low_stock_threshold' => 5,
                    'is_active' => true,
                ]
            );

            foreach ($images as $index => $url) {
                $product->images()->updateOrCreate(
                    ['path' => $url],
                    [
                        'alt' => $product->name,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]
                );
            }
        }
    }
}

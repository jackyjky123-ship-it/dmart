<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductImagesRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    /**
     * Store images for a product.
     */
    public function store(StoreProductImagesRequest $request, Product $product): RedirectResponse
    {
        /** @var UploadedFile[] $files */
        $files = $request->file('images');
        $hasExisting = $product->images()->exists();
        $nextSortOrder = (int) $product->images()->max('sort_order') + 1;

        foreach ($files as $index => $file) {
            $path = $file->store("products/{$product->id}", 'public');

            ProductImage::create([
                'product_id' => $product->id,
                'path' => $path,
                'alt' => $product->name,
                'is_primary' => (! $hasExisting && $index === 0),
                'sort_order' => $nextSortOrder + $index,
            ]);
        }

        return back()->with('status', 'Images uploaded successfully.');
    }

    /**
     * Set a product image as primary.
     */
    public function primary(Product $product, ProductImage $image): RedirectResponse
    {
        abort_if($image->product_id !== $product->id, 404);

        DB::transaction(function () use ($product, $image): void {
            $product->images()->where('id', '!=', $image->id)->update(['is_primary' => false]);
            $image->update(['is_primary' => true]);
        });

        return back()->with('status', 'Primary image updated.');
    }

    /**
     * Delete a product image.
     */
    public function destroy(Product $product, ProductImage $image): RedirectResponse
    {
        abort_if($image->product_id !== $product->id, 404);

        DB::transaction(function () use ($product, $image): void {
            $wasPrimary = $image->is_primary;

            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }

            $image->delete();

            if ($wasPrimary) {
                $next = $product->images()->orderBy('sort_order')->orderBy('id')->first();
                if ($next) {
                    $next->update(['is_primary' => true]);
                }
            }
        });

        return back()->with('status', 'Image deleted.');
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreProductImagesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'images' => ['required', 'array', 'min:1', 'max:5'],
            'images.*' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    /**
     * Enforce the five-image limit across existing and new uploads.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $product = $this->route('product');

            if (! $product instanceof Product) {
                return;
            }

            $files = $this->file('images');
            $requested = is_array($files) ? count($files) : 0;
            $remaining = max(0, 5 - $product->images()->count());

            if ($requested > $remaining) {
                $validator->errors()->add(
                    'images',
                    $remaining === 0
                        ? 'This product already has the maximum of 5 images.'
                        : "You can upload at most {$remaining} more image(s) for this product."
                );
            }
        });
    }
}

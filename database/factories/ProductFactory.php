<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'sku' => strtoupper(fake()->unique()->bothify('???-###-???')),
            'description' => fake()->paragraph(),
            'price_cents' => fake()->numberBetween(100, 10000),
            'compare_at_price_cents' => null,
            'stock' => fake()->numberBetween(0, 100),
            'low_stock_threshold' => 5,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the product has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => fake()->numberBetween(0, 4),
            'low_stock_threshold' => 5,
        ]);
    }

    /**
     * Indicate that the product has a compare-at price.
     */
    public function withComparePrice(): static
    {
        return $this->state(fn (array $attributes) => [
            'compare_at_price_cents' => (int) (($attributes['price_cents'] ?? 1000) * 1.3),
        ]);
    }
}

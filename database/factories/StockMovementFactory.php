<?php

namespace Database\Factories;

use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'type' => StockMovementType::Sale,
            'quantity_delta' => fake()->numberBetween(-10, -1),
            'reason' => null,
            'user_id' => null,
            'order_id' => null,
        ];
    }

    /**
     * Indicate a restock movement.
     */
    public function restock(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => StockMovementType::Restock,
            'quantity_delta' => fake()->numberBetween(10, 100),
        ]);
    }

    /**
     * Indicate an adjustment movement.
     */
    public function adjustment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => StockMovementType::Adjustment,
            'quantity_delta' => fake()->numberBetween(-5, 5),
            'reason' => fake()->sentence(),
        ]);
    }

    /**
     * Indicate a return movement.
     */
    public function return(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => StockMovementType::Return,
            'quantity_delta' => fake()->numberBetween(1, 5),
        ]);
    }
}

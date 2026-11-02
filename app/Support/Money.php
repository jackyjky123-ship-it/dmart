<?php

namespace App\Support;

use InvalidArgumentException;

final class Money
{
    /**
     * Parse a decimal string into integer cents.
     *
     * Accepts: '12', '12.5', '12.50'. Rejects more than 2 decimal places.
     *
     * @throws InvalidArgumentException
     */
    public static function parse(string $decimal): int
    {
        $decimal = trim($decimal);

        if (! preg_match('/^\d+(\.\d{1,2})?$/', $decimal)) {
            throw new InvalidArgumentException("Invalid monetary value: {$decimal}. Use up to 2 decimal places.");
        }

        [$whole, $fraction] = array_pad(explode('.', $decimal, 2), 2, '');

        return (int) $whole * 100 + (int) str_pad($fraction, 2, '0');
    }

    /**
     * Format integer cents as a dollar string.
     *
     * Example: 1250 → '$12.50'
     */
    public static function format(int $cents): string
    {
        return '$'.number_format($cents / 100, 2, '.', ',');
    }
}

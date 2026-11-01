<?php

use App\Support\Money;

test('parses integer string to cents', function () {
    expect(Money::parse('12'))->toBe(1200)
        ->and(Money::parse('0'))->toBe(0)
        ->and(Money::parse('100'))->toBe(10000);
});

test('parses decimal string to cents', function () {
    expect(Money::parse('12.5'))->toBe(1250)
        ->and(Money::parse('12.50'))->toBe(1250)
        ->and(Money::parse('0.99'))->toBe(99);
});

test('rejects more than 2 decimal places or non-numeric values', function () {
    expect(fn () => Money::parse('12.555'))->toThrow(InvalidArgumentException::class)
        ->and(fn () => Money::parse('abc'))->toThrow(InvalidArgumentException::class)
        ->and(fn () => Money::parse('-5'))->toThrow(InvalidArgumentException::class);
});

test('formats cents to dollar string', function () {
    expect(Money::format(1250))->toBe('$12.50')
        ->and(Money::format(0))->toBe('$0.00')
        ->and(Money::format(99))->toBe('$0.99')
        ->and(Money::format(100000))->toBe('$1,000.00');
});

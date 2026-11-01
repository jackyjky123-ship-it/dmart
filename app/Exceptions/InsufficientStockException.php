<?php

namespace App\Exceptions;

use RuntimeException;

class InsufficientStockException extends RuntimeException
{
    public function __construct(string $message = 'Insufficient stock available for this product.')
    {
        parent::__construct($message);
    }
}

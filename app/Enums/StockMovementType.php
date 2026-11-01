<?php

namespace App\Enums;

enum StockMovementType: string
{
    case Sale = 'sale';
    case Restock = 'restock';
    case Adjustment = 'adjustment';
    case Return = 'return';
}

<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Cashier = 'cashier';
    case Admin = 'admin';
}

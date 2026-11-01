<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response
    {
        /** @var Request $request */
        $user = $request->user();

        $home = match ($user->role) {
            UserRole::Admin => '/admin',
            UserRole::Cashier => '/pos',
            default => $request->session()->pull('url.intended', '/'),
        };

        return redirect()->intended($home);
    }
}

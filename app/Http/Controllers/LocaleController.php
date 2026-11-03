<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    /**
     * Update the application locale.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'locale' => 'required|string|in:en,km',
        ]);

        session(['locale' => $validated['locale']]);

        return back()->withCookie(cookie()->forever('locale', $validated['locale']));
    }
}

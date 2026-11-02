<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    /**
     * Display the cashier and admin accounts.
     */
    public function index(): Response
    {
        $staff = User::query()
            ->whereIn('role', [UserRole::Admin, UserRole::Cashier])
            ->orderBy('name')
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at?->format('M d, Y'),
            ])
            ->all();

        return Inertia::render('admin/staff/index', [
            'staff' => $staff,
        ]);
    }

    /**
     * Create a real cashier or admin account.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'role' => ['required', Rule::in([UserRole::Cashier->value, UserRole::Admin->value])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => $validated['password'],
            'is_active' => true,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$user->name} was created with the {$user->role->value} role.",
        ]);

        return back();
    }

    /**
     * Activate or deactivate a staff account.
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        $this->ensureStaff($user);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        if ($user->is($request->user()) && ! $validated['is_active']) {
            throw ValidationException::withMessages([
                'is_active' => 'You cannot deactivate your own account.',
            ]);
        }

        $user->update(['is_active' => $validated['is_active']]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$user->name} is now ".($user->is_active ? 'active.' : 'inactive.'),
        ]);

        return back();
    }

    /**
     * Reset a staff member's password.
     */
    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        $this->ensureStaff($user);

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user->update(['password' => $validated['password']]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Password reset for {$user->name}.",
        ]);

        return back();
    }

    private function ensureStaff(User $user): void
    {
        abort_unless(in_array($user->role, [UserRole::Admin, UserRole::Cashier], true), 404);
    }
}

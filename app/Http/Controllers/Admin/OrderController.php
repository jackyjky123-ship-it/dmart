<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\StockService;
use App\Support\OrderPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display every order with lightweight server-side filters.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $channel = $request->string('channel')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $orders = Order::query()
            ->with(['items', 'user', 'cashier', 'payments'])
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('order_number', 'like', "%{$search}%")
                        ->orWhere('shipping_name', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->when(in_array($channel, ['online', 'pos'], true), fn ($query) => $query->where('channel', $channel))
            ->when($status !== '' && OrderStatus::tryFrom($status), fn ($query) => $query->where('status', $status))
            ->latest()
            ->get()
            ->map(fn (Order $order): array => OrderPresenter::summary($order))
            ->all();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'channel' => $channel,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Display one order with its full fulfillment state.
     */
    public function show(Order $order): Response
    {
        $order->load(['items', 'user', 'cashier', 'payments']);

        return Inertia::render('admin/orders/show', [
            'order' => OrderPresenter::detail($order),
        ]);
    }

    /**
     * Update fulfillment details and status.
     */
    public function update(Request $request, Order $order, StockService $stockService): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(OrderStatus::class)],
            'carrier' => ['nullable', 'string', 'max:100'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
        ]);

        $status = OrderStatus::from($validated['status']);

        if ($order->status === OrderStatus::Cancelled && $status !== OrderStatus::Cancelled) {
            throw ValidationException::withMessages([
                'status' => 'Cancelled orders cannot be reopened because their stock was already returned.',
            ]);
        }

        if ($status === OrderStatus::Cancelled) {
            $this->cancelOrder($order, $stockService);

            Inertia::flash('toast', ['type' => 'info', 'message' => 'Order cancelled and stock returned.']);

            return back();
        }

        $attributes = [
            'status' => $status,
            'carrier' => $validated['carrier'] ?? null,
            'tracking_number' => $validated['tracking_number'] ?? null,
        ];

        if (in_array($status, [
            OrderStatus::Paid,
            OrderStatus::Processing,
            OrderStatus::Shipped,
            OrderStatus::Delivered,
            OrderStatus::Completed,
        ], true) && $order->paid_at === null) {
            $attributes['paid_at'] = now();
        }

        if ($status === OrderStatus::Shipped && $order->shipped_at === null) {
            $attributes['shipped_at'] = now();
        }

        if (in_array($status, [OrderStatus::Delivered, OrderStatus::Completed], true) && $order->delivered_at === null) {
            $attributes['delivered_at'] = now();
        }

        $order->update($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Order {$order->order_number} updated."]);

        return back();
    }

    /**
     * Cancel an order and return its items to stock exactly once.
     */
    public function cancel(Order $order, StockService $stockService): RedirectResponse
    {
        $this->cancelOrder($order, $stockService);

        Inertia::flash('toast', ['type' => 'info', 'message' => "Order {$order->order_number} cancelled."]);

        return back();
    }

    private function cancelOrder(Order $order, StockService $stockService): void
    {
        if ($order->status === OrderStatus::Cancelled) {
            return;
        }

        try {
            DB::transaction(function () use ($order, $stockService): void {
                $order->load('items.product');

                foreach ($order->items as $item) {
                    if (! $item->product) {
                        continue;
                    }

                    $stockService->increment(
                        $item->product,
                        $item->quantity,
                        StockMovementType::Return,
                        ['order_id' => $order->id, 'reason' => 'Admin cancelled order']
                    );
                }

                $order->payments()->update(['status' => PaymentStatus::Cancelled->value]);
                $order->update([
                    'status' => OrderStatus::Cancelled,
                    'cancelled_at' => now(),
                ]);
            });
        } catch (InsufficientStockException $exception) {
            throw ValidationException::withMessages([
                'status' => $exception->getMessage(),
            ]);
        }
    }
}

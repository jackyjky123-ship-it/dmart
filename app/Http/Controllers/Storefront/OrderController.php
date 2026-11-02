<?php

namespace App\Http\Controllers\Storefront;

use App\Enums\OrderChannel;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Services\StockService;
use App\Support\OrderPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    private const FREE_SHIPPING_THRESHOLD_CENTS = 3500;

    private const SHIPPING_FEE_CENTS = 200;

    /**
     * Display the authenticated customer's orders.
     */
    public function index(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->with(['items', 'user', 'payments'])
            ->latest()
            ->get()
            ->map(fn (Order $order): array => OrderPresenter::summary($order))
            ->all();

        return Inertia::render('storefront/orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the checkout form.
     */
    public function checkout(): Response
    {
        return Inertia::render('storefront/checkout');
    }

    /**
     * Create a real order from the cart and start the demo payment flow.
     */
    public function store(Request $request, StockService $stockService): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_id' => ['required', 'integer', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'shipping_name' => ['required', 'string', 'max:255'],
            'shipping_phone' => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'shipping_city' => ['required', 'string', 'max:100'],
            'shipping_notes' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', Rule::enum(PaymentMethod::class)],
        ]);

        $requestedItems = collect($validated['items']);
        $productIds = $requestedItems->pluck('product_id')->unique();

        $products = Product::query()
            ->active()
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        if ($products->count() !== $productIds->count()) {
            throw ValidationException::withMessages([
                'items' => 'One or more items in your bag are no longer available.',
            ]);
        }

        $lineItems = $requestedItems->map(function (array $item) use ($products): array {
            $product = $products->get($item['product_id']);
            $quantity = (int) $item['quantity'];

            if ($quantity > $product->stock) {
                throw ValidationException::withMessages([
                    'items' => "Only {$product->stock} unit(s) of {$product->name} are available.",
                ]);
            }

            return [
                'product' => $product,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'unit_price_cents' => $product->price_cents,
                'quantity' => $quantity,
                'line_total_cents' => $product->price_cents * $quantity,
            ];
        });

        $subtotalCents = $lineItems->sum('line_total_cents');
        $shippingFeeCents = $subtotalCents >= self::FREE_SHIPPING_THRESHOLD_CENTS
            ? 0
            : self::SHIPPING_FEE_CENTS;
        $totalCents = $subtotalCents + $shippingFeeCents;
        $paymentMethod = PaymentMethod::from($validated['payment_method']);

        try {
            $order = DB::transaction(function () use (
                $request,
                $validated,
                $lineItems,
                $subtotalCents,
                $shippingFeeCents,
                $totalCents,
                $paymentMethod,
                $stockService
            ): Order {
                $order = Order::create([
                    'order_number' => $this->generateOrderNumber(),
                    'user_id' => $request->user()->id,
                    'channel' => OrderChannel::Online,
                    'status' => OrderStatus::PendingPayment,
                    'payment_method' => $paymentMethod,
                    'subtotal_cents' => $subtotalCents,
                    'shipping_fee_cents' => $shippingFeeCents,
                    'total_cents' => $totalCents,
                    'shipping_name' => $validated['shipping_name'],
                    'shipping_phone' => $validated['shipping_phone'],
                    'shipping_address' => $validated['shipping_address'],
                    'shipping_city' => $validated['shipping_city'],
                    'shipping_notes' => $validated['shipping_notes'] ?? null,
                ]);

                foreach ($lineItems as $lineItem) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $lineItem['product_id'],
                        'product_name' => $lineItem['product_name'],
                        'product_sku' => $lineItem['product_sku'],
                        'unit_price_cents' => $lineItem['unit_price_cents'],
                        'quantity' => $lineItem['quantity'],
                        'line_total_cents' => $lineItem['line_total_cents'],
                    ]);

                    $stockService->decrement(
                        $lineItem['product'],
                        $lineItem['quantity'],
                        StockMovementType::Sale,
                        ['order_id' => $order->id, 'reason' => 'Online order']
                    );
                }

                if ($paymentMethod === PaymentMethod::Khqr) {
                    Payment::create([
                        'order_id' => $order->id,
                        'provider' => 'demo_khqr',
                        'method' => PaymentMethod::Khqr,
                        'reference' => 'DEMO-'.Str::uuid(),
                        'amount_cents' => $totalCents,
                        'status' => PaymentStatus::Pending,
                        'payload' => ['simulated' => true],
                    ]);
                }

                return $order;
            });
        } catch (InsufficientStockException $exception) {
            throw ValidationException::withMessages([
                'items' => $exception->getMessage(),
            ]);
        }

        if ($paymentMethod === PaymentMethod::Khqr) {
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Order created. Complete the demo payment to continue.',
            ]);

            return redirect()->route('payment.show', $order);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Order placed. Pay the courier in cash on delivery.',
        ]);

        return redirect()->route('orders.show', $order);
    }

    /**
     * Display the demo payment screen for a pending order.
     */
    public function payment(Request $request, Order $order): Response|RedirectResponse
    {
        $this->ensureOwnedBy($request, $order);

        if ($order->status === OrderStatus::Cancelled || $order->payment_method === PaymentMethod::Cash) {
            return redirect()->route('orders.show', $order);
        }

        $order->load(['items', 'payments']);

        return Inertia::render('storefront/payment', [
            'order' => OrderPresenter::detail($order),
        ]);
    }

    /**
     * Simulate a KHQR success, failure, or retry response.
     */
    public function simulatePayment(Request $request, Order $order): RedirectResponse
    {
        $this->ensureOwnedBy($request, $order);

        $validated = $request->validate([
            'outcome' => ['required', Rule::in(['success', 'failure', 'retry'])],
        ]);

        if ($order->status === OrderStatus::Cancelled) {
            return back()->withErrors(['outcome' => 'Cancelled orders cannot be paid.']);
        }

        DB::transaction(function () use ($order, $validated): void {
            $payment = $order->payments()->latest('id')->first();

            if (! $payment) {
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'provider' => 'demo_khqr',
                    'method' => PaymentMethod::Khqr,
                    'reference' => 'DEMO-'.Str::uuid(),
                    'amount_cents' => $order->total_cents,
                    'status' => PaymentStatus::Pending,
                    'payload' => ['simulated' => true],
                ]);
            }

            if ($validated['outcome'] === 'success') {
                $payment->update([
                    'status' => PaymentStatus::Paid,
                    'payload' => ['simulated' => true, 'result' => 'success'],
                    'paid_at' => now(),
                ]);

                if (! in_array($order->status, [
                    OrderStatus::Processing,
                    OrderStatus::Shipped,
                    OrderStatus::Delivered,
                    OrderStatus::Completed,
                ], true)) {
                    $order->update([
                        'status' => OrderStatus::Paid,
                        'paid_at' => now(),
                    ]);
                }

                return;
            }

            if ($validated['outcome'] === 'failure') {
                $payment->update([
                    'status' => PaymentStatus::Failed,
                    'payload' => ['simulated' => true, 'result' => 'failure'],
                    'paid_at' => null,
                ]);

                return;
            }

            $payment->update([
                'status' => PaymentStatus::Pending,
                'payload' => ['simulated' => true, 'result' => 'retry'],
                'paid_at' => null,
            ]);

            if ($order->status === OrderStatus::PendingPayment || $order->status === OrderStatus::Paid) {
                $order->update([
                    'status' => OrderStatus::PendingPayment,
                    'paid_at' => null,
                ]);
            }
        });

        $toast = match ($validated['outcome']) {
            'success' => ['type' => 'success', 'message' => 'Demo payment confirmed.'],
            'failure' => ['type' => 'error', 'message' => 'Demo payment failed. You can retry.'],
            default => ['type' => 'info', 'message' => 'Demo payment reset to pending.'],
        };

        Inertia::flash('toast', $toast);

        return redirect()->route('payment.show', $order);
    }

    /**
     * Display a single order belonging to the authenticated customer.
     */
    public function show(Request $request, Order $order): Response
    {
        $this->ensureOwnedBy($request, $order);

        $order->load(['items', 'payments']);

        return Inertia::render('storefront/orders/show', [
            'order' => OrderPresenter::detail($order),
        ]);
    }

    /**
     * Cancel a pending order and return its items to stock.
     */
    public function cancel(Request $request, Order $order, StockService $stockService): RedirectResponse
    {
        $this->ensureOwnedBy($request, $order);

        if ($order->status !== OrderStatus::PendingPayment) {
            return back()->withErrors(['order' => 'Only orders awaiting payment can be cancelled.']);
        }

        DB::transaction(function () use ($order, $stockService): void {
            $order->load('items');

            foreach ($order->items as $item) {
                $product = $item->product;

                if (! $product) {
                    continue;
                }

                $stockService->increment(
                    $product,
                    $item->quantity,
                    StockMovementType::Return,
                    ['order_id' => $order->id, 'reason' => 'Customer cancelled order']
                );
            }

            $order->payments()->update(['status' => PaymentStatus::Cancelled->value]);
            $order->update([
                'status' => OrderStatus::Cancelled,
                'cancelled_at' => now(),
            ]);
        });

        Inertia::flash('toast', [
            'type' => 'info',
            'message' => "Order {$order->order_number} was cancelled.",
        ]);

        return redirect()->route('orders.index');
    }

    private function ensureOwnedBy(Request $request, Order $order): void
    {
        abort_unless($order->user_id === $request->user()->id, 404);
    }

    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'DM-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}

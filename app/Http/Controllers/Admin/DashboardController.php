<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Support\OrderPresenter;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the real back-office dashboard metrics.
     */
    public function index(): Response
    {
        $revenueStatuses = [
            OrderStatus::Paid,
            OrderStatus::Processing,
            OrderStatus::Shipped,
            OrderStatus::Delivered,
            OrderStatus::Completed,
        ];

        $revenueCents = (int) Order::query()
            ->whereIn('status', $revenueStatuses)
            ->sum('total_cents');

        $paidOrderCount = Order::query()
            ->whereIn('status', $revenueStatuses)
            ->count();

        $recentOrders = Order::query()
            ->with(['items', 'user', 'payments'])
            ->latest()
            ->take(6)
            ->get()
            ->map(fn (Order $order): array => OrderPresenter::summary($order))
            ->all();

        $topProducts = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereIn('orders.status', $revenueStatuses)
            ->selectRaw('order_items.product_name as name, order_items.product_sku as sku, SUM(order_items.quantity) as units_sold, SUM(order_items.line_total_cents) as revenue_cents')
            ->groupBy('order_items.product_name', 'order_items.product_sku')
            ->orderByDesc('revenue_cents')
            ->take(5)
            ->get()
            ->map(fn (OrderItem $item): array => [
                'name' => $item->name,
                'sku' => $item->sku,
                'units_sold' => (int) $item->units_sold,
                'revenue_cents' => (int) $item->revenue_cents,
            ])
            ->all();

        $salesByDay = $this->salesByDay($revenueStatuses);
        $ordersByHour = $this->ordersByHour();

        $categorySales = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->whereIn('orders.status', $revenueStatuses)
            ->selectRaw('categories.name as name, SUM(order_items.quantity) as units_sold, SUM(order_items.line_total_cents) as revenue_cents')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue_cents')
            ->get()
            ->map(fn (OrderItem $item): array => [
                'name' => $item->name,
                'units_sold' => (int) $item->units_sold,
                'revenue_cents' => (int) $item->revenue_cents,
            ])
            ->all();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'revenue_cents' => $revenueCents,
                'order_count' => Order::query()->count(),
                'paid_order_count' => $paidOrderCount,
                'pending_order_count' => Order::query()
                    ->whereIn('status', [OrderStatus::PendingPayment, OrderStatus::Paid, OrderStatus::Processing])
                    ->count(),
                'customer_count' => User::query()->where('role', UserRole::Customer)->count(),
                'new_customer_count' => User::query()
                    ->where('role', UserRole::Customer)
                    ->where('created_at', '>=', now()->subDays(30))
                    ->count(),
                'low_stock_count' => Product::query()
                    ->where('is_active', true)
                    ->whereColumn('stock', '<=', 'low_stock_threshold')
                    ->count(),
                'average_order_cents' => $paidOrderCount > 0
                    ? (int) round($revenueCents / $paidOrderCount)
                    : 0,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'salesByDay' => $salesByDay,
            'ordersByHour' => $ordersByHour,
            'categorySales' => $categorySales,
        ]);
    }

    /**
     * Build a seven-day revenue series from real paid orders.
     *
     * @param  array<int, OrderStatus>  $revenueStatuses
     * @return array<int, array{label: string, date: string, revenue_cents: int, orders: int}>
     */
    private function salesByDay(array $revenueStatuses): array
    {
        $start = now()->subDays(6)->startOfDay();

        $orders = Order::query()
            ->whereIn('status', $revenueStatuses)
            ->where('created_at', '>=', $start)
            ->get(['created_at', 'total_cents']);

        return collect(range(6, 0))
            ->map(function (int $daysAgo) use ($orders): array {
                $date = now()->subDays($daysAgo)->startOfDay();

                $dayOrders = $orders->filter(
                    fn (Order $order): bool => $order->created_at?->isSameDay($date) ?? false
                );

                return [
                    'label' => $date->format('D'),
                    'date' => $date->format('M d'),
                    'revenue_cents' => (int) $dayOrders->sum('total_cents'),
                    'orders' => $dayOrders->count(),
                ];
            })
            ->all();
    }

    /**
     * Build a real order-count heatmap for the last 30 days.
     *
     * @return array{days: array<int, string>, hours: array<int, string>, matrix: array<int, array<int, int>>, max: int}
     */
    private function ordersByHour(): array
    {
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $hours = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'];
        $matrix = array_fill(0, count($days), array_fill(0, count($hours), 0));

        Order::query()
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->get(['created_at'])
            ->each(function (Order $order) use (&$matrix): void {
                /** @var Carbon $createdAt */
                $createdAt = $order->created_at;
                $dayIndex = $createdAt->dayOfWeekIso - 1;
                $hourIndex = $createdAt->hour - 9;

                if ($hourIndex >= 0 && $hourIndex < 7) {
                    $matrix[$dayIndex][$hourIndex]++;
                }
            });

        $flat = array_merge(...$matrix);

        return [
            'days' => $days,
            'hours' => $hours,
            'matrix' => $matrix,
            'max' => max($flat) ?: 0,
        ];
    }
}

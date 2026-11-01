export function formatMoney(cents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(cents / 100);
}

export function centsToDollars(cents: number): string {
    return (cents / 100).toFixed(2);
}

export function dollarsToCents(dollars: string | number): number {
    const val = typeof dollars === 'string' ? parseFloat(dollars) : dollars;
    if (isNaN(val)) return 0;
    return Math.round(val * 100);
}

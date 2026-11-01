import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

export function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 99,
    size = 'md',
    disabled = false,
    className,
}: QuantityStepperProps) {
    const handleDecrement = () => {
        if (value > min && !disabled) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max && !disabled) {
            onChange(value + 1);
        }
    };

    const sizeClasses = {
        sm: {
            container: 'h-7 text-xs',
            btn: 'w-7 h-7 p-0',
            icon: 'w-3 h-3',
            input: 'w-8 text-xs',
        },
        md: {
            container: 'h-9 text-sm',
            btn: 'w-9 h-9 p-0',
            icon: 'w-3.5 h-3.5',
            input: 'w-10 text-sm',
        },
        lg: {
            container: 'h-11 text-base',
            btn: 'w-11 h-11 p-0',
            icon: 'w-4 h-4',
            input: 'w-12 text-base',
        },
    }[size];

    return (
        <div
            className={cn(
                'inline-flex items-center border rounded-lg overflow-hidden bg-background shadow-xs',
                sizeClasses.container,
                disabled && 'opacity-50 pointer-events-none',
                className
            )}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                disabled={value <= min || disabled}
                className={cn('rounded-none hover:bg-muted text-muted-foreground', sizeClasses.btn)}
                aria-label="Decrease quantity"
            >
                <Minus className={sizeClasses.icon} />
            </Button>
            <span
                className={cn(
                    'font-medium text-center tabular-nums select-none flex items-center justify-center',
                    sizeClasses.input
                )}
            >
                {value}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                disabled={value >= max || disabled}
                className={cn('rounded-none hover:bg-muted text-muted-foreground', sizeClasses.btn)}
                aria-label="Increase quantity"
            >
                <Plus className={sizeClasses.icon} />
            </Button>
        </div>
    );
}

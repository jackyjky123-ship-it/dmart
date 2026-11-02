import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer select-none transition-all duration-150 ease-out active:scale-[0.98] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-sm",
        emerald:
          "bg-[#F25623] text-white shadow-xs hover:bg-[#e04818] hover:shadow-md hover:shadow-[#F25623]/25 active:bg-[#c93c10]",
        orange:
          "bg-[#F25623] text-white shadow-xs hover:bg-[#e04818] hover:shadow-md hover:shadow-[#F25623]/25 active:bg-[#c93c10]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:shadow-sm focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-border/80 bg-background/80 backdrop-blur-xs shadow-2xs hover:bg-accent hover:text-accent-foreground hover:border-border",
        secondary:
          "bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        subtle:
          "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 active:bg-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70",
        gradient:
          "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 hover:shadow-md hover:shadow-emerald-600/35 hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline active:scale-100 active:translate-y-0",
      },
      size: {
        xs: "h-7 rounded-lg px-2.5 text-xs has-[>svg]:px-2 gap-1.5",
        sm: "h-8.5 rounded-lg px-3 text-xs has-[>svg]:px-2.5 gap-1.5",
        default: "h-10 rounded-xl px-4 py-2 has-[>svg]:px-3.5",
        lg: "h-11.5 rounded-xl px-6 text-base font-semibold has-[>svg]:px-4.5 gap-2.5",
        xl: "h-13 rounded-2xl px-8 text-base font-bold has-[>svg]:px-5 gap-3",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8.5 rounded-lg",
        "icon-xs": "size-7 rounded-md",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Slot>
    )
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : undefined}
      {...props}
    >
      {loading && <Spinner className="size-4 animate-spin shrink-0" />}
      {loading && loadingText ? <span>{loadingText}</span> : children}
    </button>
  )
}

export { Button, buttonVariants }

"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500":
              variant === "default",
            "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100":
              variant === "outline",
            "text-gray-700 hover:bg-gray-100":
              variant === "ghost",
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

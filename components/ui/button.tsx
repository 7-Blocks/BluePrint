"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed rounded-full";
    const variants = {
      primary: "bg-white text-black hover:bg-white/90 active:scale-[0.98]",
      secondary: "bg-[#141414] text-white hover:bg-[#1c1c1c] border border-[#262626] active:scale-[0.98]",
      ghost: "bg-transparent text-[#999] hover:text-white hover:bg-[#141414] active:scale-[0.98]",
      danger: "bg-transparent text-red-400 hover:bg-red-500/10 border border-red-500/20 active:scale-[0.98]",
    };
    const sizes = {
      sm: "text-[13px] px-3 py-1.5 h-8",
      md: "text-[14px] px-4 py-2.5 h-9",
      lg: "text-[14px] px-5 py-2.5 h-10",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };

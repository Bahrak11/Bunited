import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, isLoading, children, disabled, ...props }, ref) => {
    const isSpinning = loading || isLoading;
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25",
      secondary: "bg-white text-primary border border-primary hover:bg-primary/5",
      outline: "border-2 border-white/30 text-white hover:bg-white/10",
      ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isSpinning}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isSpinning && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

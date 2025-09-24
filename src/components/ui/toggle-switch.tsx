import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
}

const ToggleSwitch = React.forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  ({ checked, onCheckedChange, size = "md", className, disabled = false, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-6 w-11",
      md: "h-8 w-14",
      lg: "h-12 w-20",
      xl: "h-16 w-28",
    };

    const knobSizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6", 
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    };

    const translateClasses = {
      sm: checked ? "translate-x-5" : "translate-x-1",
      md: checked ? "translate-x-6" : "translate-x-1",
      lg: checked ? "translate-x-8" : "translate-x-2",
      xl: checked ? "translate-x-12" : "translate-x-2",
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          checked 
            ? "bg-gradient-to-r from-green-400 to-green-600 shadow-lg shadow-green-500/25" 
            : "bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg shadow-gray-500/25",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none relative inline-block transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out",
            knobSizeClasses[size],
            translateClasses[size],
            checked ? "shadow-green-200" : "shadow-gray-200"
          )}
        >
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200",
              checked ? "opacity-100" : "opacity-0"
            )}
          >
            <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2L5 9.414 9.707 4.707a1 1 0 00-1.414-1.414L5 6.586 2.293 3.879a1 1 0 00-1.414 1.414z" />
            </svg>
          </span>
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200",
              checked ? "opacity-0" : "opacity-100"
            )}
          >
            <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 12 12">
              <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
    );
  }
);

ToggleSwitch.displayName = "ToggleSwitch";

export { ToggleSwitch };
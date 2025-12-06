import React from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: "default" | "floating";
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      variant = "default",
      size = "md",
      className = "",
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const baseInputClasses = `
      w-full rounded-lg transition-all duration-200 font-inter
      bg-white dark:bg-slate-800
      border border-slate-300 dark:border-slate-600
      text-slate-900 dark:text-white
      placeholder:text-slate-500 dark:placeholder:text-slate-400
      focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
      disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
      ${sizeClasses[size]}
      ${error ? "border-red-500 focus:ring-red-500" : ""}
      ${icon ? "pl-10" : ""}
      ${className}
    `;

    if (variant === "floating") {
      return (
        <div className="relative">
          <input
            ref={ref}
            {...props}
            placeholder=" "
            className={`${baseInputClasses} peer`}
          />
          {label && (
            <label className="absolute left-4 top-2.5 px-1 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-rose-600 dark:peer-focus:text-rose-400 bg-white dark:bg-slate-800">
              {label}
            </label>
          )}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle size={18} />
            </div>
          )}
          {error && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {error}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input ref={ref} {...props} className={baseInputClasses} />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle size={18} />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={14} /> {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;

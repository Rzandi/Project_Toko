import { motion } from "framer-motion";
import { useState } from "react";

type AnimatedInputProps = {
  label: string;
  name: string;
  id?: string;
  type?: string;
  value: string;
  autoComplete?: string;
  ariaLabel?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
};

export default function AnimatedInput({
  label,
  name,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  className = "",
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  const inputClasses = `
    w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600
    rounded-lg outline-none transition-colors duration-200
    placeholder-transparent
    focus:border-blue-500 dark:focus:border-blue-400
    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
    ${error ? "border-red-500 focus:border-red-600" : ""}
    ${className}
  `;

  const labelClasses = `
    absolute left-4 origin-top-left
    text-gray-700 dark:text-gray-300 font-medium
    transition-colors duration-200
    ${error ? "text-red-500" : "group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400"}
  `;

  const inputId = id ?? name;
  const errorId = `${inputId}-error`;

  return (
    <motion.div className="relative mb-6 group" layout>
      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          className={`${inputClasses} resize-none`}
          aria-label={undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          required={required}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClasses}
          aria-label={undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          required={required}
        />
      )}

      <motion.label
        htmlFor={inputId}
        className={labelClasses}
        initial={
          isFocused || hasValue ? { y: -24, scale: 0.85 } : { y: 12, scale: 1 }
        }
        animate={
          isFocused || hasValue ? { y: -24, scale: 0.85 } : { y: 12, scale: 1 }
        }
        transition={{ duration: 0.2 }}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </motion.label>

      {error && (
        <motion.p
          id={errorId}
          className="mt-1 text-sm text-red-500 dark:text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

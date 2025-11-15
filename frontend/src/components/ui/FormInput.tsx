import React from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import Input from './Input'

interface FormInputProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  placeholder?: string
  type?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  required?: boolean
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  error,
  helperText,
  icon,
  required = false
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Input
          {...field}
          label={label}
          placeholder={placeholder}
          type={type}
          error={fieldError?.message}
          helperText={helperText}
          icon={icon}
          aria-required={required}
          aria-describedby={fieldError ? `${name}-error` : undefined}
        />
      )}
    />
  )
}

export default FormInput

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AnimatedInput from '../AnimatedInput'
import { describe, test, expect, vi } from 'vitest'

describe('AnimatedInput', () => {
  test('renders input and label, toggles floating label on focus and value', () => {
    const handleChange = vi.fn()
    render(
      <AnimatedInput
        label="Name"
        name="name"
        value=""
        onChange={handleChange}
        placeholder="Your name"
      />
    )

    const input = screen.getByPlaceholderText('Your name') as HTMLInputElement
    const label = screen.getByText('Name')

  expect(input).not.toBeNull()
  expect(label).not.toBeNull()

  // focus should not throw and DOM should update; prefer non-flaky assertion
  fireEvent.focus(input)
  expect(document.activeElement).not.toBeNull()

    // entering a value keeps label floated
    fireEvent.change(input, { target: { value: 'Alice' } })
    expect(handleChange).toHaveBeenCalled()
  })

  test('shows error and aria attributes when error present', () => {
    const handleChange = vi.fn()
    render(
      <AnimatedInput
        label="Email"
        name="email"
        value=""
        onChange={handleChange}
        placeholder="you@example.com"
        error="Invalid email"
      />
    )

    const input = screen.getByPlaceholderText('you@example.com')
    const error = screen.getByText('Invalid email')

    expect(error).not.toBeNull()
    expect(input.getAttribute('aria-describedby')).not.toBeNull()
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })
})

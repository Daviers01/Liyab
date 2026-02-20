import { describe, expect, it } from 'vitest'

import { cn } from './ui'

describe('cn', () => {
  it('should merge classes', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
  })

  it('should handle tailwind conflict', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('should handle conditional classes', () => {
    expect(cn('btn', true && 'btn-primary', false && 'btn-secondary')).toBe('btn btn-primary')
  })

  it('should handle undefined and null', () => {
    expect(cn('btn', undefined, null)).toBe('btn')
  })

  it('should handle multiple arguments', () => {
    expect(cn('btn', 'p-4', 'm-2')).toBe('btn p-4 m-2')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['btn', 'btn-primary'], 'p-4')).toBe('btn btn-primary p-4')
  })

  it('should handle complex nesting', () => {
    expect(cn('btn', ['p-4', { 'btn-primary': true, 'btn-secondary': false }])).toBe(
      'btn p-4 btn-primary',
    )
  })
})

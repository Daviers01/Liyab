import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ImageMedia } from './index'

// Mock next/image to capture props
vi.mock('next/image', () => ({
  default: (props: { quality?: number; alt?: string }) => {
    // Render a span with the quality prop as a data attribute for easy testing
    return <span data-testid="next-image" data-quality={props.quality}>{props.alt}</span>
  },
}))

describe('ImageMedia', () => {
  it('renders NextImage without explicit quality prop (uses default)', () => {
    const resource = {
      id: 1,
      alt: 'Test Image',
      url: '/test-image.jpg',
      width: 800,
      height: 600,
      updatedAt: '2023-01-01T00:00:00.000Z',
    }

    render(<ImageMedia resource={resource} />)

    const nextImage = screen.getByTestId('next-image')
    expect(nextImage.getAttribute('data-quality')).toBeNull()
  })
})

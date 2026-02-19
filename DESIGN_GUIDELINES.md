# Design Guidelines

## Overview
This document outlines the design system for Chanfolio, inspired by a premium corporate aesthetic with bold orange/amber accents, high contrast, and professional typography. The design focuses on conversion-oriented layouts with a modern, minimalist SaaS application feel.

---

## Color Palette

### Primary Colors (Orange/Amber Spectrum)
The brand uses warm orange and amber tones to create energy, confidence, and visual impact.

#### Light Mode
- **Primary**: `oklch(65% 0.22 35deg)` - Vibrant orange
- **Background**: White/light neutrals
- **Foreground**: Near black for maximum contrast

#### Dark Mode
- **Primary**: `oklch(70% 0.22 35deg)` - Brighter orange for visibility
- **Background**: `oklch(10%)` - Deep near-black for premium feel
- **Foreground**: Near white

### Utility Colors
- **Orange Scale**: 
  - `orange-500`: Primary actions, CTAs
  - `orange-600`: Hover states, emphasis
  - `orange-700`: Dark mode text
  - `orange-100`: Light backgrounds
  - `orange-900/30`: Dark mode backgrounds

- **Amber Scale**:
  - `amber-500`: Secondary accents
  - `amber-600`: Complementary highlights
  - `amber-400`: Dark mode secondary text

- **Yellow Scale**:
  - `yellow-500`: Tertiary accents in gradients
  - `yellow-400`: Dark mode tertiary text

### Semantic Colors
- **Card**: Semi-transparent backgrounds with backdrop blur
- **Border**: Subtle borders at 50% opacity for depth
- **Muted**: Secondary text at reduced prominence
- **Secondary**: Background elements and tags

---

## Typography

### Font Hierarchy
- **Headings**: Bold, high-impact
  - H1: `text-5xl` (3rem) - Section titles
  - H2: `text-3xl` (1.875rem) - Subsections
  - H3: `text-2xl` (1.5rem) - Categories
- **Body**: Medium weight for readability
  - Large: `text-xl` (1.25rem) - Introductions
  - Base: `text-base` (1rem) - Standard content
  - Small: `text-sm` (0.875rem) - Secondary info
  - Extra Small: `text-xs` (0.75rem) - Labels, badges

### Font Weights
- **Bold** (700): Headlines, emphasis, CTA text
- **Medium** (500): Body text, descriptions
- **Regular** (400): Secondary content

### Text Colors
- **Foreground**: Primary text color (high contrast)
- **Muted Foreground**: Secondary text (reduced emphasis)
- **Primary**: Brand color for emphasis and links

---

## Spacing & Layout

### Container Widths
- **Max Width**: Responsive containers with generous breathing room
- **Section Padding**: Large vertical spacing (5-8rem) between sections
- **Content Padding**: `px-6` to `px-12` horizontal padding

### Gaps
- **Small**: `gap-2` to `gap-4` (0.5-1rem) - Inline elements
- **Medium**: `gap-6` to `gap-8` (1.5-2rem) - Cards, components
- **Large**: `gap-12` to `gap-16` (3-4rem) - Sections, major divisions
- **Extra Large**: `gap-20` (5rem) - Major layout sections

### Grid Systems
- **Skills Grid**: 2-4 columns responsive
- **Projects Grid**: 1-2 columns responsive
- **Experience/Certifications**: Full width cards

---

## Components

### Cards

#### Premium Glass Effect
All card components use a sophisticated glass morphism style:
```css
bg-card/80           /* 80% opacity background */
backdrop-blur-sm     /* Frosted glass blur */
border border-border/50  /* Subtle 50% opacity border */
rounded-lg           /* Smooth corner radius */
```

#### Hover States
```css
hover:shadow-xl      /* Enhanced shadow elevation */
hover:border-primary/50  /* Orange accent border on hover */
transition-all       /* Smooth animations */
```

#### Card Types
1. **Skill Cards**: Icon + name, consistent sizing
2. **Experience Cards**: Timeline format with company logos
3. **Certification Cards**: Horizontal layout with badges
4. **Project Cards**: Browser chrome + screenshot preview

### Buttons & CTAs

#### Primary Button
```css
bg-gradient-to-r from-orange-500 to-amber-600
text-white font-bold
px-8 py-4
rounded-lg
hover:shadow-lg hover:scale-105
transition-all
```

#### Text Links
```css
text-primary          /* Orange in theme */
hover:underline
font-medium to font-bold
transition-colors
```

### Badges & Tags

#### Category Badges
- **Client Work**: `bg-orange-100 text-orange-700` (light) / `bg-orange-900/30 text-orange-400` (dark)
- **Personal Projects**: `bg-amber-100 text-amber-700` (light) / `bg-amber-900/30 text-amber-400` (dark)

#### Skill Tags
```css
bg-secondary text-secondary-foreground
text-xs px-3 py-1
rounded-md font-medium
```

### Gradients

#### Hero Gradients
Used for prominent headings and CTAs:
```css
bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500
bg-clip-text text-transparent
```

#### Background Gradients
Subtle ambient lighting effects:
```css
bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10
```

#### Glow Effects
For emphasis and visual hierarchy:
```css
shadow-[0_0_100px_rgba(249,115,22,0.3)]  /* Orange glow */
shadow-[0_0_100px_rgba(245,158,11,0.3)]  /* Amber glow */
```

---

## Interactive States

### Transitions
- **Default**: `transition-all` for comprehensive animations
- **Colors**: `transition-colors` for text/background changes
- **Transform**: `transition-transform duration-300` for scaling effects

### Hover Effects
1. **Cards**: Shadow elevation + border accent
2. **Images**: Scale 105% with smooth transition
3. **Buttons**: Shadow + slight scale increase
4. **Links**: Underline + color change

### Focus States
All interactive elements should have visible focus indicators for accessibility.

---

## Dark Mode Strategy

### Implementation
Uses `[data-theme='dark']` attribute with CSS variables in `globals.css`.

### Key Differences
1. **Background**: Much darker (`oklch(10%)`) for premium contrast
2. **Primary Color**: Slightly brighter orange for visibility
3. **Borders**: Maintain 50% opacity for consistency
4. **Glass Effect**: More pronounced with darker backgrounds

### Color Adjustments
- Light mode uses darker text variants (`-600`, `-700`)
- Dark mode uses lighter text variants (`-400`)
- Gradients maintain same hue spectrum

---

## Accessibility

### Contrast Ratios
- Maintain WCAG AA standard (4.5:1) for normal text
- Maintain WCAG AAA standard (7:1) for important content
- Orange primary color chosen for sufficient contrast on both themes

### Focus Indicators
- Visible keyboard navigation
- High contrast focus rings
- Consistent focus styling across components

### Motion
- Respect `prefers-reduced-motion` for users sensitive to animations
- Keep transitions smooth but not excessive (300ms standard)

---

## Image Guidelines

### Logos
- **Company Logos**: White transparent SVG for dark backgrounds
- **Product Logos**: Colored originals for brand recognition
- **Brand Logo**: Cropped with proper aspect ratio (180x50px display)

### Screenshots
- **Aspect Ratio**: 16:9 for project previews
- **Quality**: High-resolution for Retina displays
- **Format**: Optimized (WebP preferred, JPEG fallback)

### Icons
- **Size**: Consistent dimensions within categories
- **Style**: Modern, flat design
- **Format**: SVG for scalability

---

## Animation Principles

### Micro-interactions
- **Scale**: 105% on hover for cards/buttons
- **Shadow**: Elevation change for depth
- **Border**: Subtle color shift to primary

### Loading States
- Skeleton screens with subtle shimmer
- Smooth fade-in for content appearance

### Page Transitions
- Minimal, professional motion
- Focus on content, not flashy animations

---

## Responsive Breakpoints

### Tailwind Defaults
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Component Behavior
- **Mobile First**: Design scales up from mobile
- **Grid Collapse**: Multi-column grids become single column on mobile
- **Typography Scale**: Slightly smaller on mobile for readability
- **Spacing Reduction**: Proportionally smaller gaps on smaller screens

---

## Code Conventions

### Component Structure
```tsx
'use client';  // For interactive components

import { cn } from '@/utilities/ui';  // Utility for conditional classes

interface Props {
  // TypeScript interfaces for all props
}

export const Component = ({ props }: Props) => {
  return (
    <div className="semantic-class-order">
      {/* Layout → Display → Sizing → Spacing → Colors → Effects */}
    </div>
  );
};
```

### Class Ordering
1. Layout (flex, grid, position)
2. Display & visibility
3. Sizing (w-, h-)
4. Spacing (p-, m-, gap)
5. Typography (text-, font-)
6. Colors (bg-, text-, border-)
7. Effects (shadow, rounded, transition)
8. States (hover:, focus:, dark:)

### File Organization
```
src/
├── app/(frontend)/
│   ├── about/
│   │   ├── components/     # Reusable UI components
│   │   ├── data/          # Data files (skills, projects, etc.)
│   │   ├── sections/      # Page sections
│   │   └── page.tsx       # Main layout
│   └── globals.css        # Theme variables
```

---

## Performance Considerations

### Image Optimization
- Use Next.js `Image` component for automatic optimization
- Lazy load images below the fold
- Provide proper width/height for layout stability

### CSS Optimization
- Leverage Tailwind's purging for minimal CSS
- Use CSS variables for theme values
- Prefer backdrop-blur over complex background images

### Component Patterns
- Use `'use client'` only when necessary
- Keep data separate from presentation
- Optimize re-renders with proper React patterns

---

## Design Philosophy

### Core Principles
1. **Professional & Premium**: High contrast, bold typography, sophisticated color use
2. **Conversion-Focused**: Clear CTAs, visual hierarchy, purposeful layout
3. **Modern Minimalism**: Clean interfaces, generous whitespace, purposeful elements
4. **Brand Consistency**: Orange/amber throughout, Liyab Digital identity
5. **Accessibility First**: Semantic HTML, contrast standards, keyboard navigation

### Visual Language
- **Energy & Confidence**: Warm orange tones inspire action
- **Professionalism**: Dark backgrounds and clean layouts
- **Clarity**: High contrast ensures readability
- **Depth**: Glass morphism and shadows create visual interest
- **Motion**: Subtle, purposeful animations enhance UX

---

## Maintenance & Updates

### Theme Updates
All color changes should be made in `globals.css` CSS variables to ensure consistency across the application.

### Component Updates
Follow the established patterns for:
- Card styling: glass effect + hover states
- Gradients: orange/amber/yellow spectrum
- Spacing: generous gaps and padding
- Typography: bold headings, medium body

### Adding New Features
1. Use existing components as templates
2. Follow color palette (orange/amber/yellow)
3. Maintain premium styling (glass effects, shadows)
4. Ensure dark mode compatibility
5. Test responsive behavior

---

*Last Updated: Based on mood board transformation (Orange/Amber Premium Theme)*

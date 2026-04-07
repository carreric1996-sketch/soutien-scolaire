# Design Specification: Teacher Dashboard

This document outlines the design system for the **Teacher Dashboard**, extracted from the "Academic Atelier" framework. It captures the core design tokens, including color palettes, typography, and spacing principles.

## 1. Design Tokens

### Colors
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary** | `#00113a` | Brand primary color. |
| **Primary Container** | `#002366` | Secondary brand blue for backgrounds/headers. |
| **Background** | `#f8f9fb` | Main application background. |
| **Surface** | `#f8f9fb` | Base level for UI elements. |
| **On Surface** | `#191c1e` | Primary text color. |
| **On Surface Variant** | `#444650` | Secondary text color. |
| **Tertiary Container** | `#003011` | Success/Active state background. |
| **On Tertiary Container** | `#00a64b` | Success/Active state text color. |
| **Tertiary Fixed** | `#66ff8e` | Signature green (e.g., WhatsApp integration). |
| **Error** | `#ba1a1a` | Error/Warning states. |

### Typography
- **Headlines & Display:** `Manrope` (Geometric confidence, editorial feel)
- **Body & Labels:** `Inter` (Academic precision, readability)
- **Scale:** Modular scale focused on contrast between massive display metrics and precision-engineered labels.

### Shapes & Roundness
- **Radius Scale:** `ROUND_FOUR` (0.375rem / 6px) for standard components.
- **Buttons:** `md` radius (0.375rem).
- **Status Badges:** `full` (Pill) radius.

### Spacing
- **Spacing Scale:** `3` (Standardized multiplier for consistent breathing room).
- **Breathing Room Principle:** Prioritize white space over physical divider lines.

## 2. Design Strategy: The Academic Atelier

### The "No-Line" Rule
Physical boundaries are defined solely through background color shifts. **1px solid borders are prohibited** for sectioning content.
- **Elevation:** Use tonal layering (e.g., `surface-container-lowest` on `surface`) to imply structure.

### Surface Hierarchy
1. **Base:** `surface` (#f8f9fb)
2. **Hero/Elevated:** `surface-container-lowest` (#ffffff)
3. **Subtle Inset:** `surface-container-highest` (#e1e2e4)

### Glassmorphism
Floating elements (dropdowns, modals) use:
- **Opacity:** 80% (`surface-container-lowest`)
- **Blur:** 12px - 20px (Backdrop Blur)
- **Gradients:** Subtle linear gradients (135°) from `primary` to `primary_container` for CTAs.

## 3. Implementation Guidelines

- **Text:** Never use pure black (#000000). Use `on_surface` (#191c1e).
- **Shadows:** Extra-diffused shadows (`rgba(0, 11, 58, 0.06)`) for floating states, avoiding "muddy" default shadows.
- **Interactions:** Use tonal shifts (e.g., `surface-container-high`) for hover states.

# Header Implementation Plan

## Goal
Create a production-grade, "Antigravity" header that unifies navigation and the theme toggle.

## Design
- **Style**: Floating, glassmorphism (backdrop-blur), clear visual hierarchy.
- **Position**: Fixed top, auto-hiding on scroll down (optional) or persistent slightly transparent.
- **Content**:
    - Brand (Left): "Crevix" (Text or Logo)
    - Nav (Center): Hidden on mobile, visible on desktop.
    - Actions (Right): Theme Toggle.

## UI/UX Enhancements (Uiverse/Three.js inspired)
- **Theme Toggle**: Refactor to a "Liquid Switch" or "Mechanical Toggle" style.
- **Interactions**: Subtle hover states, magnetic pull.

## Steps
1.  [NEW] `src/components/ui/Header.tsx`
2.  [MODIFY] `src/components/ui/ThemeToggle.tsx` (Accept `className`, improve styling)
3.  [MODIFY] `src/app/layout.tsx` (Implement Header)

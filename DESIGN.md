# Design System: Animedoro / Tasks Page
**Project ID:** 13210935788954753346

## 1. Visual Theme & Atmosphere
The interface features an airy, clean, productivity-oriented aesthetic with gamified elements. It balances generous spacing with bold, vibrant accent colors against muted backgrounds to ensure high readability. The dark mode maintains the same structure but inverses the surface brightness, utilizing a very dark, slightly purple-tinted base to provide depth without resorting to pure black. Elements are separated physically using subtle borders or soft drop shadows, rather than hard dividers, promoting a modern, floating "glassmorphism" feel in sticky headers.

## 2. Color Palette & Roles
* **Primary / Royal Purple** (#7c3bed): The dominant brand and accent color. Used for primary call-to-action buttons, active states, progress indicators, and important visual highlights. Focuses the user's attention.
* **Background Light** (#f7f6f8): The base app background in light mode. Soft, non-distracting off-white to reduce eye strain.
* **Background Dark** (#171121): The base app background in dark mode. A very dark, cool shade with a subtle purple tint to harmonize with the Primary color.
* **Surface Default** (#ffffff / #0f172a): Pure white in light mode, deep slate in dark mode. Used for cards, sidebars, and elevated containers.
* **Text Primary** (slate-900 / slate-100): High contrast ink for main headings, values, and essential text.
* **Text Secondary** (slate-600 / slate-400): Muted tone for paragraphs, inactive navigation items, labels, and timestamps.
* **Accent Orange** (orange-100 bg / orange-600 text): Used for XP / gamification metadata icons.
* **Accent Blue** (blue-100 bg / blue-600 text): Used for time/schedule metadata icons.
* **Accent Green** (green-100 bg / green-600 text): Used for task completion and success metrics.
* **Accent Yellow** (yellow-500): Used specifically for character energy/stamina bars.
* **Translucent Primary** (primary/5 or primary/10): Used extensively for subtle hover states, input backgrounds, and decorative outlines.

## 3. Typography Rules
* **Font Family:** Inter (sans-serif) is used throughout the application to provide a clean, geometric, and highly legible text reading experience.
* **Weights:** Hierarchy is strictly maintained utilizing Regular (400), Medium (500), Semibold (600), and Bold (700). 
* **Character Spacing:** Main headers use negative letter-spacing (`tracking-tight`) to feel cohesive and punchy. Small utility labels or uppercase tags use extremely wide letter spacing (`tracking-wider`, `tracking-[0.3em]`) to stand out graphically.

## 4. Component Stylings
* **Buttons:** Main action buttons are generously rounded, either pill-shaped or rounded-2xl. Primary buttons employ the Primary color alongside a distinct colored drop shadow (`shadow-lg shadow-primary/30`) to emphasize interactivity. Secondary action buttons rely on muted slate backgrounds. Hover states generally darken or lighten the background organically.
* **Cards/Containers:** Elevated slightly from the background using generous border radii (`rounded-2xl`, `rounded-3xl` for main feature cards) and subtle borders (`border-primary/10`). They utilize soft, low-opacity drop shadows (`shadow-sm`) to separate them from the background canvas.
* **Inputs/Forms:** Borderless by default with a soft translucent background (`bg-primary/5`). Fully rounded corners (`rounded-lg`) and feature a soft scaling focus ring (`focus:ring-2 focus:ring-primary/20`) upon interaction.
* **Avatars/Icons:** Avatars are fully rounded (`rounded-full`) and occasionally feature a solid outline border. Icons are consistently drawn from the Material Symbols Outlined set.

## 5. Layout Principles
* **Whitespace & Spacing:** The application makes heavy use of breathing room, with component gaps scaling from `gap-2` up to `gap-8` and paddings often reaching `p-8` or `p-12`.
* **Grid & Flexbox Alignment:** The layout is driven by a sidebar-to-main-content flex architecture. Information cards are distributed in equal fraction grids (`grid-cols-3`). Elements are strictly aligned either center or between within flex containers.
* **Depth & Stacking:** Persistent structural elements (like top headers) utilize CSS backdrop filters (`backdrop-blur-md`) combined with translucent backgrounds (`bg-white/50`) to create a floating depth effect over scrollable content.

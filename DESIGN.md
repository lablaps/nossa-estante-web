---
version: alpha
name: Nossa Estante
description: A bright editorial community reading product with luminous green actions, soft white surfaces, deep forest dark mode, oversized rounded geometry, and atmospheric library imagery.
colors:
  primary: "#13EC5B"
  primary-soft: "#DCFCE7"
  background: "#F8FAF9"
  background-soft: "#F6F8F6"
  surface: "#FFFFFF"
  surface-tint: "#F4F8F5"
  surface-dark: "#1A3524"
  background-dark: "#102216"
  text-main: "#0D1B12"
  text-muted: "#4C9A66"
  on-dark: "#FFFFFF"
  on-dark-muted: "#B8C4BC"
  ink: "#090C0B"
  overlay-scrim: "#000000"
  notification: "#EF4444"
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.6
  body-md:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.6
  body-sm:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.08em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: 0.28em
rounded:
  none: 0px
  xs: 12px
  sm: 16px
  md: 24px
  lg: 28px
  xl: 32px
  hero: 40px
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 40px
  "3xl": 48px
  page-gutter: 24px
  card-padding: 20px
  card-padding-lg: 32px
  hero-padding: 40px
  modal-padding: 32px
  section-gap: 24px
  chip-gap: 8px
shadows:
  card-soft: "0 12px 32px rgba(13, 27, 18, 0.06)"
  card-medium: "0 20px 45px rgba(0, 0, 0, 0.10)"
  hero-panel: "0 24px 70px rgba(15, 23, 20, 0.10)"
  floating-nav: "0 24px 50px rgba(0, 0, 0, 0.10)"
  modal: "0 35px 100px rgba(0, 0, 0, 0.24)"
  cta-glow: "0 12px 30px rgba(19, 236, 91, 0.25)"
elevation:
  low: "border-led white surface with soft shadow separation"
  medium: "rounded white or tinted card with border and deeper ambient shadow"
  high: "backdrop-blurred panel or modal with strong shadow and subtle edge highlight"
motion:
  duration-fast: 150ms
  duration-standard: 300ms
  duration-slow: 700ms
  duration-entrance: 800ms
  easing-standard: "ease"
  easing-emphasized: "cubic-bezier(0.16, 1, 0.3, 1)"
  hover-lift: "translateY(-2px)"
  press-scale: "scale(0.98)"
components:
  app-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-main}"
    typography: "{typography.body-md}"
  sidebar-desktop:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding-lg}"
  app-shell-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.on-dark}"
  bottom-nav-mobile:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  hero-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.hero}"
    padding: "{spacing.hero-padding}"
  hero-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding-lg}"
  kpi-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 14px 24px
  button-primary-hover:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.text-main}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 14px 24px
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 14px 24px
  filter-chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 10px 20px
  filter-chip-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 10px 20px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 16px
  book-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  book-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  auth-modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.hero}"
    padding: "{spacing.modal-padding}"
  modal-scrim:
    backgroundColor: "{colors.overlay-scrim}"
  notification-badge:
    backgroundColor: "{colors.notification}"
    textColor: "{colors.text-main}"
  helper-text:
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.body-sm}"
  supporting-text:
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
  page-section-soft:
    backgroundColor: "{colors.background-soft}"
    rounded: "{rounded.lg}"
---

## Overview

Nossa Estante is a community reading product with a bright, social, contemporary identity. The visual language blends a soft editorial atmosphere with energetic marketplace cues: large welcoming headlines, library imagery used as mood rather than decoration, and an unmistakable neon green accent that signals action, availability, and circulation.

The interface should feel optimistic, breathable, and people-first. It is not academic, dusty, or austere. Even when the UI references bookshelves and collections, the emotional tone remains fresh and active. The product should read as a living community exchange space rather than a static digital catalog.

The current experience is strongest when it combines:

- soft white or pale mint surfaces
- oversized rounded geometry
- deep forest dark mode surfaces
- punchy electric-green primary actions
- a layered editorial hero with photographic warmth and glass-like overlays

## Colors

The palette is anchored by a vivid action green and a family of soft neutrals. Green is the brand signal. It should be used decisively for primary actions, active navigation, progress emphasis, and small accents that imply availability or momentum.

- **Primary (`#13EC5B`)** is the main driver for calls to action, active chips, focus states, and high-priority actions.
- **Text Main (`#0D1B12`)** is a dense forest ink used for headlines and high-contrast interface text.
- **Background (`#F8FAF9`)** and **Background Soft (`#F6F8F6`)** create a clean, slightly botanical foundation that feels calmer and more premium than pure white.
- **Surface (`#FFFFFF`)** is the core card and panel color. White should remain dominant across light mode layouts.
- **Text Muted (`#4C9A66`)** is not a gray. It is a softened green, which keeps the whole UI harmonized around the core accent.
- **Ink (`#090C0B`)** is used for dense KPI cards, dark promotional bands, and moments that need stronger contrast and seriousness.
- **Surface Dark (`#1A3524`)** and **Background Dark (`#102216`)** define dark mode and atmospheric dark surfaces. They should stay forest-toned, never neutral charcoal.

Use red sparingly for alerts or notifications only. The system should never become rainbow-heavy. If additional emphasis is needed, solve it with tonal contrast, shadow, or scale before introducing another hue.

## Typography

Typography is bold, friendly, and contemporary. The system uses **Plus Jakarta Sans** for the brand voice and display hierarchy, paired with **Noto Sans** for calmer body copy. This creates a useful split:

- **Plus Jakarta Sans** carries the product personality. It should be used for hero headings, section titles, CTAs, navigation labels, KPI values, and strong interface moments.
- **Noto Sans** is the reading layer. Use it for descriptive text, supporting copy, helper text, and content blocks that need steadier rhythm.

The hierarchy is intentionally dramatic at the top of the page. Headlines are oversized, tight, and high-contrast. Labels are frequently uppercase with generous tracking to create a sense of system clarity and wayfinding.

Typography should feel:

- large before it feels dense
- bold before it feels decorative
- direct before it feels verbose

Avoid lightweight typography. The product identity depends on confident weights and clean spacing more than on font variety.

## Layout & Spacing

The layout system is mobile-first and card-driven, built on an 8px base rhythm with larger 24px and 32px steps defining most panel spacing. The overall structure relies on containment:

- a persistent shell
- rounded cards and sections
- internal padding generous enough to make each block feel breathable

Common layout patterns:

- **Desktop shell:** fixed left sidebar plus scrollable main content column
- **Mobile shell:** full-width content with a floating bottom navigation bar
- **Hero composition:** a large photographic background with one primary content panel and one structured metrics area
- **Content streams:** horizontal carousels for books, dense but still padded
- **Authentication:** a centered modal with strong containment and enough interior height for a multi-step flow

Whitespace should remain visible around large sections. The design works best when the app never feels edge-to-edge compressed. Even on mobile, preserve rounded containers and clear breathing room around controls.

## Elevation & Depth

Depth is created through three techniques working together:

1. **Soft ambient shadow**
2. **Subtle border definition**
3. **Selective blur or translucency**

The UI does not use harsh drop shadows or dense neumorphism. Cards float lightly above the pale background. Large panels, especially the hero panel and auth modal, gain depth through broader, softer shadows and translucent white layers. KPI cards are an exception: they use dark fills and moderate shadowing to create strong visual anchors against the soft editorial hero.

The product’s depth model should feel calm and premium:

- standard white cards: soft separation
- floating navigation: stronger shadow but still feathered
- modals: visibly elevated, rounded, and centered with a dark scrim behind
- hero overlays: translucent, softened, and atmospheric rather than opaque

## Shapes

Rounded geometry is a core part of the visual identity. Straight rectangles weaken the friendliness of the system. The product consistently uses large radii:

- **12px to 16px** for smaller content cards and inputs
- **24px to 28px** for buttons, chips, and navigation containers
- **32px to 40px** for major surfaces like heroes and modals
- **full pills** for compact filters, metadata chips, and top-level CTA buttons

Rounded forms should feel intentional and slightly oversized. The UI should look soft and tactile, but not bubbly or childish. Maintain consistency: once a view establishes a radius family, avoid mixing in dramatically sharper corners.

## Components

### Navigation

Desktop navigation is quiet by default and bold when active. Active items use the brand green as a filled state rather than an underline. The mobile navigation is floating and elevated, with the center action standing proud above the bar.

### Hero

The hero is editorial and atmospheric. It should combine:

- real-world library or bookshelf imagery
- a softened gradient wash for readability
- one principal message block
- one structured information block

The image is never the content by itself; it is a backdrop. The readable layer should sit above it with clear tonal separation.

### Buttons

Primary buttons are green, dark-text, and bold. They should feel inviting and immediate.

Secondary buttons are typically white or lightly translucent, with dark text and subtle border treatment. Dark buttons are reserved for moments of stronger emphasis or contrast-rich promotional surfaces.

All action buttons should support:

- a slight lift on hover
- a slight scale-down on press
- a strong readability contrast at all times

### Chips and Filters

Chips are compact, rounded, and label-driven. Active chips should use the primary green fill. Inactive chips remain white or lightly tinted with soft borders. Chips should feel crisp and navigational, not ornamental.

### Cards

There are two primary card families:

- **Surface cards:** white, soft-shadowed, subtle-border containers for books, content, and forms
- **Metric cards:** dense dark cards with white values and green labels

Metric cards should be compact and structured. Surface cards can feel more relaxed and editorial.

### Inputs

Inputs are large, rounded, and easy to scan. Authentication inputs especially should feel soft, centered, and high-confidence. Avoid narrow or overly technical field styling. The visual language favors supportive form containers over minimal underlines.

### Authentication Modal

The auth experience is a central, elevated modal with a calm soft-white gradient background and large rounded corners. It should feel like a focused layer above the product, not a separate brand. The multi-step signup flow must preserve generous spacing, obvious progress cues, and smooth horizontal movement between steps.

## Do's and Don'ts

- Do use the primary green for the most important action on a screen.
- Do keep white surfaces dominant in light mode.
- Do preserve large radii and generous padding on major sections.
- Do use photographic library imagery as atmosphere, not as busy content.
- Do keep headings bold, concise, and confidently scaled.
- Do maintain a clear distinction between soft surface cards and dark metric cards.
- Don't introduce random accent colors to solve hierarchy.
- Don't flatten the interface by removing all shadows and borders at once.
- Don't use tiny or low-weight typography for core actions.
- Don't make every panel translucent; blur and transparency work best as selective emphasis.
- Don't let dark mode drift into generic black-gray. It should remain forest-toned.
- Don't crowd hero content. The system feels best when one strong message leads the screen.

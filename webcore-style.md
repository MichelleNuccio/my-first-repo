# Webcore / Internetcore Style Guide

## Aesthetic Direction

The website follows a **Webcore / Internetcore** aesthetic inspired by early 2000s personal websites, Windows XP interfaces, pop-up windows, error messages, pixel graphics, and colorful internet nostalgia.

The visual language should feel playful, slightly chaotic, digital, and nostalgic. It should look like a webpage discovered inside an old desktop computer, mixing system UI elements with bright decorative web graphics.

## Visual References

The style is inspired by:

- Windows XP and early desktop interfaces
- Internet Explorer-era web pages
- Pop-up alerts and system windows
- Pixel art and low-resolution web graphics
- Early 2000s personal homepages
- Glitch effects and RGB color separation
- Terminal-style text and fake file paths

## Color Palette

The palette uses bright, high-contrast colors associated with early web design.

| Color | Hex | Usage |
|---|---:|---|
| Deep blue | `#000080` | Main title background and retro UI contrast |
| Windows blue | `#0066cc` / `#004a99` | Fake window title bars |
| Cyan | `#00ffff` | Glitch shadow and digital accents |
| Magenta | `#ff00ff` | Glitch shadow and decorative dots |
| Yellow | `#ffff00` | Main title text and warning-style accents |
| Terminal green | `#00ff00` | Message display / console effect |
| Light gray | `#c0c0c0` | Classic button surface |
| Beige gray | `#ece9d8` | Windows XP-style panel background |
| Black | `#000000` | Terminal, shadows, hard outlines |

## Typography

The typography should feel like it belongs to old operating systems and early websites.

Primary fonts:

- `"MS Sans Serif"`
- `"Tahoma"`
- `"Verdana"`

Display / glitch fonts:

- `"Courier New"` for digital, terminal, and file-system references

The typography should avoid looking too modern or polished. Monospace text, uppercase labels, and simple system fonts help reinforce the old-web feeling.

## Layout

The page uses a centered single-screen layout.

Core layout rules:

- The main content is centered vertically and horizontally.
- Elements are stacked in a column.
- The page should feel like a desktop screen rather than a modern landing page.
- Decorative interface elements are created with pseudo-elements such as `body::before` and `body::after`.

The layout is intentionally simple so the visual identity comes from the textures, colors, borders, shadows, and animations.

## Background

The background combines multiple CSS gradients:

- Small magenta, cyan, and yellow dots to suggest pixel decorations.
- A diagonal Windows XP-like landscape gradient.
- Bright sky tones, white highlight, and green ground colors.

The result should feel like a nostalgic desktop wallpaper mixed with early internet decoration.

## Components

### Main Title

The `h1` acts like a retro web banner.

Style characteristics:

- Dark blue background
- Yellow uppercase text
- White ridge border
- RGB glitch shadows in magenta and cyan
- Slight animated distortion

Purpose:

The title is the main identity element of the page. It should immediately communicate the Webcore aesthetic.

### Button

The button is styled like an old operating system button.

Style characteristics:

- Gray gradient background
- Outset border for a raised 3D effect
- Black hard shadow
- Classic system font
- Pressed state using `border-style: inset`

Hover state:

When hovered, the button becomes louder and more internet-like, using a repeating magenta, cyan, and yellow diagonal pattern.

### Message Display

The `#messageDisplay` element is styled like a terminal or system console.

Style characteristics:

- Black background
- Green monospace text
- Dashed green border
- Neon glow effect

Purpose:

This component displays user feedback or messages in a way that feels like an old computer interface.

### Fake Windows XP Window

The `body::before` pseudo-element creates a decorative fake application window.

Style characteristics:

- Blue title bar
- Beige-gray system panel
- Inset and outset shadows
- Fake file path text: `C:\WEBCORE\HELLO_WORLD.EXE`

Purpose:

This gives the page a desktop UI feeling without requiring extra HTML.

### Mini Pop-Up

The `body::after` pseudo-element creates a small decorative alert window.

Style characteristics:

- Pale yellow background
- Red exclamation marks
- Outset border
- Hard black shadow
- Slight rotation
- Wiggle animation

Purpose:

This adds the playful, chaotic pop-up energy associated with early 2000s internet browsing.

## Motion and Animation

The animation style should feel mechanical and low-frame-rate rather than smooth.

Animations used:

- `blink`: creates a blinking cursor effect.
- `glitchText`: shifts the title slightly and changes its color treatment.
- `popupWiggle`: makes the mini pop-up shake in a simple, choppy way.

Use `steps()` timing functions where possible to keep motion feeling digital and retro.

## Borders and Shadows

Borders and shadows are essential to this style.

Preferred border styles:

- `ridge`
- `outset`
- `inset`
- `dashed`

Preferred shadow style:

- Hard, offset shadows instead of soft modern shadows.
- Inset highlights and dark edges for old desktop UI depth.

Avoid overly smooth, minimal, or glassmorphism-style effects.

## Interaction Style

Interactive elements should feel tactile and slightly clunky.

Button behavior:

- Default state: raised
- Hover state: colorful and noisy
- Active state: pressed inward

The interaction should remind users of clicking old desktop buttons or web buttons from early personal websites.

## Design Principles

When extending this website, follow these rules:

- Use bright, saturated colors.
- Prefer system fonts and monospace fonts.
- Use hard borders and visible outlines.
- Add decorative pseudo-elements where possible.
- Keep motion simple, glitchy, and slightly abrupt.
- Avoid modern minimalism.
- Avoid soft rounded cards and muted palettes.
- Make the page feel handmade, digital, and nostalgic.

## Possible Additional Components

Future components that would fit this aesthetic:

- Guestbook panel
- Visitor counter
- Fake download button
- “Under construction” banner
- Pixel icon navigation
- Fake error modal
- Status bar at the bottom of the page
- Marquee-style announcement text
- Desktop shortcut icons
- Browser toolbar header

## Summary

This style is a nostalgic Webcore interface inspired by old operating systems, personal homepages, and early internet graphics. It should feel colorful, imperfect, playful, and obviously digital, as if the user has opened a forgotten webpage from the early 2000s.

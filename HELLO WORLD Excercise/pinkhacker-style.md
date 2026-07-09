# PINK HACKER TERMINAL STYLE SPECIFICATION

## Overview

This CSS defines a **Pink Hacker Terminal** aesthetic: a dark cyber interface inspired by terminal screens, hacked desktops, CRT monitors, code consoles, and monochrome data systems.

The style is based on a limited palette: black, deep purple, bright fuchsia, and soft pink highlights. The final look should feel like a compromised computer screen glowing in a dark room.

## Core Visual Identity

The style is built around five main ideas:

- A black terminal-like environment
- Fuchsia neon as the primary interface color
- Monospace typography inspired by code editors and command lines
- CRT scanlines and digital flicker
- Fake system panels, access logs, and hacking language

The result is minimal in color but visually dense through glow, grids, text, pseudo-elements, and layered screen effects.

## Color Palette

| Role | Hex | Description |
|---|---:|---|
| Primary neon | `#ff2bd6` | Main fuchsia used for text, borders, glow, and interface elements |
| Soft highlight | `#ffb8f4` | Lighter pink used for secondary labels and readable accents |
| Deep black | `#000000` | Main terminal background and shadow color |
| Almost-black purple | `#080006` | Main page base color |
| Dark fuchsia purple | `#190014` | Background depth and dark gradient tone |
| Dark magenta | `#24001c` | Secondary background depth |
| Muted visited pink | `#c76cb8` | Used for visited links |

The palette intentionally avoids many colors. This keeps the design close to a monochrome hacker terminal, while the fuchsia gives it a more stylized cyber identity.

## Typography

The design uses monospace fonts throughout.

Primary font stack:

```css
"Courier New", "Lucida Console", Monaco, monospace
```

Typography characteristics:

- Monospace characters
- Uppercase interface text
- Fake command-line syntax
- Small technical labels
- Slightly mechanical rhythm

The typography should feel like a terminal, code editor, or system log rather than a modern website.

## Layout Structure

The page uses a centered single-screen layout.

Main layout behavior:

- The `body` uses Flexbox.
- Content is centered both vertically and horizontally.
- Elements are stacked in a vertical column.
- The page has spacing between the main heading, button, and message area.
- On mobile, the layout starts from the top and allows vertical scrolling.

This makes the page feel like a focused terminal screen or system warning interface.

## Background System

The background is created with multiple CSS layers:

- A deep black/purple base
- A subtle fuchsia grid
- Radial fuchsia glow spots
- A dark diagonal gradient

These layers create depth while staying within the monochrome fuchsia terminal palette.

The grid suggests:

- Data systems
- Terminal overlays
- Wireframe interfaces
- Hacker dashboards

## Pseudo-Elements

The CSS relies heavily on pseudo-elements to create interface decoration without extra HTML.

### `body::before`

This pseudo-element creates a fake terminal/data panel in the background.

It displays text such as:

```text
Program Console
root@system:~$ scanning ports...
compiling code █ █ █ █
network storage: active
>>> DATA: I FOUND YOU
access_level = root
```

Purpose:

- Adds hacker/coding atmosphere
- Creates a second layer of UI
- Makes the page feel like a desktop full of active system windows

### `body::after`

This pseudo-element creates the CRT screen effect.

It adds:

- Horizontal scanlines
- Screen glow
- Darkened edges
- Monitor-like texture

Purpose:

- Makes the page feel like it is displayed on an old monitor
- Adds visual noise without changing the HTML
- Reinforces the cyber terminal aesthetic

## Main Heading

The `h1` is the central visual component.

It is styled as a neon terminal warning panel.

Characteristics:

- Fuchsia text
- Black translucent background
- Thin neon border
- Internal scanlines
- Strong glow
- Slight glitch-like text shadow
- Flicker animation

The heading should feel like the main system alert on a compromised machine.

### `h1::before`

Adds a small terminal status message above the heading:

```text
>_ terminal breach detected
```

Purpose:

- Introduces the hacked-system theme
- Adds command-line language
- Creates hierarchy before the main heading text

### `h1::after`

Adds an access-log style label below the heading:

```text
[ACCESS GRANTED] /usr/data/ghost-net :: 0xff2bd6
```

Purpose:

- Suggests file paths, permissions, and system access
- Makes the heading feel like part of a larger terminal interface

## Button

The button is designed as an executable command.

Visual characteristics:

- Fuchsia border
- Dark terminal background
- Neon text glow
- Hard black shadow
- Monospace uppercase text

Pseudo-elements wrap the button label like code:

```css
execute(buttonLabel);
```

### Button Hover

On hover, the button changes into a striped fuchsia/pink/black surface.

Purpose:

- Creates a more aggressive interactive state
- Suggests system activation or command execution
- Adds contrast against the dark background

### Button Active

On click, the button moves down and right.

Purpose:

- Gives tactile feedback
- Makes the interaction feel physical and old-interface inspired

## Message Display

The `#messageDisplay` element is styled as a terminal output panel.

Characteristics:

- Black background
- Fuchsia text
- Thin neon border
- Internal vertical data pattern
- Glow and inset shadow
- Left-aligned log text

It is intended to display system messages, user feedback, or generated text.

### `#messageDisplay::before`

Adds a header:

```text
YOU HAVE BEEN HACKED !
```

Purpose:

- Reinforces the central concept
- Acts like a warning banner inside the terminal panel

### Empty State

When the message display is empty, it shows:

```text
> whoami
root
> open /data
permission granted...
```

Purpose:

- Keeps the component visually active even before JavaScript updates it
- Adds narrative and coding atmosphere

## Motion Design

The motion style is intentionally simple and digital.

Animations:

- `blink`: simulates a blinking terminal cursor
- `terminalFlicker`: creates unstable monitor movement and opacity shifts

The animations use stepped timing to avoid smooth modern motion. This helps preserve the retro terminal feeling.

## Borders and Shadows

The design uses:

- Thin fuchsia borders
- Hard black shadows
- Neon glow shadows
- Inset shadows for screen depth

This creates a layered interface without using modern soft card styling.

## Interaction Rules

Interactive elements should feel like commands, not modern buttons.

Recommended interaction behavior:

- Hover states should feel like activation
- Click states should feel mechanical
- Text should use command syntax where possible
- Glows should intensify during interaction

## Responsive Behavior

On screens smaller than `520px`:

- The layout starts from the top.
- The page becomes scrollable.
- The background terminal panel is smaller.
- The button width adapts to the viewport.
- Font sizes are reduced for readability.

This keeps the style usable on mobile while preserving the terminal aesthetic.

## Design Principles

When extending this style, follow these rules:

- Use fuchsia as the main interface color.
- Keep the background very dark.
- Prefer monospace type.
- Use fake system language, file paths, commands, and logs.
- Use pseudo-elements for extra interface layers.
- Add glow, scanlines, grids, and flicker.
- Avoid soft pastels, rounded modern cards, and clean corporate UI.
- Keep the page feeling like a hacked terminal, not a polished dashboard.

## Suggested Additional Components

Components that would fit this aesthetic:

- Fake login prompt
- Terminal input field
- Access denied modal
- File explorer panel
- Matrix-style data stream
- System warning popup
- Network scan table
- Password cracking progress bar
- Fake command history
- Glitching status footer

## Summary

This CSS creates a **pink hacker terminal interface**. Its identity comes from monochrome neon color, monospace typography, fake system panels, CRT scanlines, command syntax, and glowing terminal components.

The style should feel technical, compromised, digital, and atmospheric: like a hacked computer screen rendered as a web page.

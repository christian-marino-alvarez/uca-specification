/**
 * App Vector Assets & Iconography Specification
 * 
 * Clean, scalable SVG vectors for UCA App branding, navigation, and cognitive workflows:
 * - Brand: Dynamic circular U logo glyph and UCA wordmark
 * - Ontological Core: UCA (Processor / Chip) and Capability (Puzzle piece)
 * - Systems & Telemetry: Pulse (Waveform), Branch (Decision), Network (Nodes)
 * - Actions: Terminal, Code brackets, Navigation arrow, External link
 * - Controls: Check/Positive, Trash/Destructive
 */

export const BRAND_ASSETS = {
  logo: {
    symbolSvg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 6V18C8 22.4183 11.5817 26 16 26C20.4183 26 24 22.4183 24 18V6" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    wordmarkSvg: `<svg viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 3V16C4 21.5228 8.47715 26 14 26C19.5228 26 24 21.5228 24 16V3H19.5V16C19.5 19.0376 17.0376 21.5 14 21.5C10.9624 21.5 8.5 19.0376 8.5 16V3H4Z" fill="currentColor"/>
  <path d="M54 9C52.5 5 48.5 3 43.5 3C36.0442 3 30 9.04416 30 16.5C30 23.9558 36.0442 30 43.5 30C48.5 30 52.5 28 54 24H48.5C47.2 25.5 45.5 26 43.5 26C38.2533 26 34.5 21.7467 34.5 16.5C34.5 11.2533 38.2533 7 43.5 7C45.5 7 47.2 7.5 48.5 9H54Z" fill="currentColor"/>
  <path d="M74 3L62 26H67L69.5 21H78.5L81 26H86L74 3ZM74 12L76.8 17.5H71.2L74 12Z" fill="currentColor"/>
</svg>`,
  },
} as const;

export const ICON_ASSETS = {
  // Ontological Core Entities
  uca: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="4" width="16" height="16" rx="2"></rect>
  <rect x="9" y="9" width="6" height="6"></rect>
  <line x1="9" y1="1" x2="9" y2="4"></line>
  <line x1="15" y1="1" x2="15" y2="4"></line>
  <line x1="9" y1="20" x2="9" y2="23"></line>
  <line x1="15" y1="20" x2="15" y2="23"></line>
  <line x1="20" y1="9" x2="23" y2="9"></line>
  <line x1="20" y1="14" x2="23" y2="14"></line>
  <line x1="1" y1="9" x2="4" y2="9"></line>
  <line x1="1" y1="14" x2="4" y2="14"></line>
</svg>`,

  capability: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19.439 7.85c0-1.57.802-2.54 2.14-2.54 1.35 0 2.421 1.07 2.421 2.42 0 1.34-1.071 2.42-2.421 2.42-.44 0-.85-.11-1.21-.31L20 18a2 2 0 0 1-2 2h-6.15c.2-.36.31-.77.31-1.21 0-1.35-1.08-2.42-2.42-2.42-1.34 0-2.42 1.07-2.42 2.42 0 .44.11.85.31 1.21H4a2 2 0 0 1-2-2l.15-8.15c.36.2.77.31 1.21.31 1.35 0 2.42-1.08 2.42-2.42 0-1.35-1.07-2.42-2.42-2.42-.44 0-.85.11-1.21.31L4 4a2 2 0 0 1 2-2h8.15c-.2.36-.31.77-.31 1.21 0 1.35 1.08 2.42 2.42 2.42 1.35 0 2.42-1.07 2.42-2.42 0-.44-.11-.85-.31-1.21H18a2 2 0 0 1 2 2v1.85c-.36-.2-.77-.31-1.21-.31-1.34 0-2.421 1.08-2.421 2.42 0 1.35 1.081 2.42 2.421 2.42.44 0 .85-.11 1.21-.31"></path>
</svg>`,

  // Cognitive Telemetry & Systems
  pulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
</svg>`,

  branch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="6" y1="3" x2="6" y2="15"></line>
  <circle cx="18" cy="6" r="3"></circle>
  <circle cx="6" cy="18" r="3"></circle>
  <path d="M18 9a9 9 0 0 1-9 9"></path>
</svg>`,

  network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="2" width="6" height="6" rx="1"></rect>
  <rect x="16" y="2" width="6" height="6" rx="1"></rect>
  <rect x="9" y="16" width="6" height="6" rx="1"></rect>
  <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"></path>
  <line x1="12" y1="13" x2="12" y2="16"></line>
</svg>`,

  // Navigation & Actions
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="4 17 10 11 4 5"></polyline>
  <line x1="12" y1="19" x2="20" y2="19"></line>
</svg>`,

  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="16 18 22 12 16 6"></polyline>
  <polyline points="8 6 2 12 8 18"></polyline>
</svg>`,

  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>`,

  externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
  <polyline points="15 3 21 3 21 9"></polyline>
  <line x1="10" y1="14" x2="21" y2="3"></line>
</svg>`,

  // Action States (Positive / Destructive)
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`,

  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
</svg>`,
} as const;

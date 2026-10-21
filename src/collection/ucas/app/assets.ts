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
    symbolSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="28" stroke="#6366f1" stroke-width="1" stroke-dasharray="3 4" opacity="0.25"/>
  <path d="M18 16V34C18 41.732 24.268 48 32 48C39.732 48 46 41.732 46 34V16" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  <polygon points="32,20 41,30 32,40 23,30" fill="#6366f1"/>
  <circle cx="32" cy="30" r="2.5" fill="#ffffff"/>
  <circle cx="18" cy="16" r="3.5" fill="#38bdf8"/>
  <circle cx="46" cy="16" r="3.5" fill="#a855f7"/>
  <circle cx="32" cy="48" r="3" fill="#6366f1"/>
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

const svg = (body, size = 16) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" aria-hidden="true">${body}</svg>`

export const ICONS = {
  card: svg(
    '<path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 3v2h16V7H4Zm0 5v6h16v-6H4Zm2 3h5v2H6v-2Z"/>',
  ),
  net: svg(
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z" stroke="currentColor" stroke-width="1.8"/>',
  ),
  prod: svg(
    '<path fill="currentColor" d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM6.5 8A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3Z"/>',
  ),
  cur: svg(
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 6v12M15 8.8c-.7-.7-1.7-1-3-1-1.7 0-3 .8-3 2.1 0 1.4 1.2 1.9 3 2.3 1.8.4 3 .9 3 2.3 0 1.3-1.3 2.1-3 2.1-1.3 0-2.3-.3-3-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  ),
  bank: svg(
    '<path fill="currentColor" d="M12 2 2.5 7.5V9h19V7.5L12 2ZM4 10.5h3V19H4v-8.5Zm5 0h3V19H9v-8.5Zm5 0h3V19h-3v-8.5Zm5 0h3V19h-3v-8.5ZM2 20.5h20V22H2v-1.5Z"/>',
  ),
  dig: svg(
    '<path fill="currentColor" d="M9 3h2.2l-.7 4H14l.7-4h2.2l-.7 4H20v2h-4.1l-.5 3H20v2h-4.9l-.7 4h-2.2l.7-4H9.4l-.7 4H6.5l.7-4H3v-2h4.5l.5-3H3V7h5.3L9 3Zm1.2 9-.5 3H14l.5-3H10.2Z"/>',
  ),
  shield: svg(
    '<path fill="currentColor" d="M12 2 4 5.4v5.2c0 5 3.3 8.7 8 10.4 4.7-1.7 8-5.4 8-10.4V5.4L12 2Zm-1 13.2-3.2-3.2 1.4-1.4 1.8 1.8 4.6-4.6 1.4 1.4-6 6Z"/>',
  ),
  check: svg(
    '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5.4-5.4 1.4 1.4-6.8 6.8Z"/>',
  ),
  x: svg(
    '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.5 12.1-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1Z"/>',
  ),
  alert: svg(
    '<path fill="currentColor" d="M12 2.5 22 20.5H2L12 2.5Zm-1 6v6h2v-6h-2Zm0 8v2h2v-2h-2Z"/>',
  ),
  sun: svg(
    '<path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    19,
  ),
  moon: svg(
    '<path fill="currentColor" d="M12 22a10 10 0 0 0 9.5-13.1A8.5 8.5 0 0 1 11 3.2 10 10 0 0 0 12 22Z"/>',
    18,
  ),
}

export const CHIP_SVG = `<svg width="38" height="28" viewBox="0 0 34 26" fill="none" aria-hidden="true"><rect x="1" y="1" width="32" height="24" rx="5" fill="rgba(255,255,255,.25)"/><path d="M1 9h12M1 17h12M33 9H21M33 17H21M13 1v24M21 1v24" stroke="rgba(255,255,255,.7)" stroke-width="1.4"/></svg>`

export const RED_LOGO_SVG = `<svg viewBox="0 0 44 30" width="40" height="28" aria-hidden="true"><rect x="8" y="3" width="28" height="24" rx="3" transform="rotate(45 22 15)" fill="#e63329"/><text x="22" y="19.5" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="10" fill="#fff">red</text></svg>`

export function getIcon(name) {
  return ICONS[name] || ICONS.card
}

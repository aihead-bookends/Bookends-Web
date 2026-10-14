/* ==========================================================================
   The background: the essence of each brand's country, as ink line art.
   Aiko → Korea, Beshak → India, Capiche → Italy.
   Each icon is drawn on a 64×64 grid in currentColor; shapes with class "f"
   get a soft accent fill from style.css.
   ========================================================================== */
window.BOOKENDS_ESSENCE = {
  // India's mandala: blooms behind the title in the intro, and sits behind the About art
  mandala() {
    const ring = (n, draw) => Array.from({ length: n }, (_, i) => draw((360 / n) * i)).join('');
    return `<svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" stroke-width=".9">
      <circle r="97"/><circle r="91"/>
      ${ring(36, (a) => `<circle cy="-84" r="3.2" transform="rotate(${a})"/>`)}
      ${ring(16, (a) => `<path d="M0-36C11-50 11-64 0-76C-11-64-11-50 0-36z" transform="rotate(${a})"/>`)}
      ${ring(16, (a) => `<path d="M0-46C3-53 3-60 0-66" transform="rotate(${a})"/>`)}
      <circle r="34"/>
      ${ring(8, (a) => `<path d="M0-10C8-18 8-26 0-32C-8-26-8-18 0-10z" transform="rotate(${a + 22.5})"/>`)}
      <circle r="8"/><circle r="2.5" fill="currentColor"/>
    </svg>`;
  },

  icons: {
    /* Korea · Aiko */
    seoulTower: `
      <path d="M32 4v9"/>
      <path d="M25 13h14l-2 9H27z"/>
      <rect class="f" x="27.5" y="15" width="9" height="4"/>
      <path d="M29 22l-2 28M35 22l2 28M27.8 32h8.4M27.2 40h9.6"/>
      <path d="M4 58c8-8 18-10 28-10s20 2 28 10"/>`,
    palace: `
      <path d="M4 24c10 2 18-4 28-12 10 8 18 14 28 12"/>
      <path d="M10 24c2 3 6 4 10 4h24c4 0 8-1 10-4"/>
      <rect class="f" x="14" y="31" width="36" height="5"/>
      <path d="M14 28v24M26 28v24M38 28v24M50 28v24"/>
      <path d="M8 52h48M5 58h54"/>`,
    taegeuk: `
      <circle cx="32" cy="32" r="22"/>
      <path class="f" d="M10 32A22 22 0 0 1 54 32A11 11 0 0 1 32 32A11 11 0 0 0 10 32z"/>
      <path d="M8 12l5 5M12 8l5 5M47 13l5-5M51 17l5-5M8 52l5-5M12 56l5-5M47 51l5 5M51 47l5 5"/>`,
    mugunghwa: `
      <g transform="translate(32 33)">
        <path d="M0-5C-9-9-11-22 0-27C11-22 9-9 0-5z"/>
        <path d="M0-5C-9-9-11-22 0-27C11-22 9-9 0-5z" transform="rotate(72)"/>
        <path d="M0-5C-9-9-11-22 0-27C11-22 9-9 0-5z" transform="rotate(144)"/>
        <path d="M0-5C-9-9-11-22 0-27C11-22 9-9 0-5z" transform="rotate(216)"/>
        <path d="M0-5C-9-9-11-22 0-27C11-22 9-9 0-5z" transform="rotate(288)"/>
      </g>
      <circle class="f" cx="32" cy="33" r="5"/>`,
    lantern: `
      <path d="M32 4v5M24 9h16"/>
      <rect x="20" y="12" width="24" height="32" rx="4"/>
      <rect class="f" x="20" y="20" width="24" height="16"/>
      <path d="M26 12v32M38 12v32"/>
      <path d="M28 44h8M32 44v9M29 53l3 7 3-7"/>`,
    fan: `
      <path d="M32 52L8 28A34 34 0 0 1 56 28z"/>
      <path class="f" d="M15 35A24 24 0 0 1 49 35L56 28A34 34 0 0 0 8 28z"/>
      <path d="M32 52L19 20.6M32 52V18M32 52l13-31.4M32 52v8"/>`,

    /* India · Beshak */
    tajMahal: `
      <path d="M6 58h52"/>
      <path d="M14 58V40h36v18"/>
      <path d="M28 58v-9a4 4 0 0 1 8 0v9"/>
      <path class="f" d="M22 40c0-12 4-16 10-20 6 4 10 8 10 20z"/>
      <path d="M32 20v-6M30 14h4"/>
      <path d="M9 58V31M55 58V31"/>
      <circle cx="9" cy="28" r="2.5"/><circle cx="55" cy="28" r="2.5"/>`,
    lotus: `
      <path class="f" d="M32 50c-6-8-6-20 0-30 6 10 6 22 0 30z"/>
      <path d="M32 50c-10-2-17-10-19-22 10 2 17 10 19 22zM32 50c10-2 17-10 19-22-10 2-17 10-19 22z"/>
      <path d="M32 50c-12 2-21-1-26-7 9-4 18-2 26 7zM32 50c12 2 21-1 26-7-9-4-18-2-26 7z"/>
      <path d="M12 56h40"/>`,
    peacock: `
      <path d="M30 60C28 46 30 30 36 14"/>
      <ellipse cx="38" cy="18" rx="10" ry="13" transform="rotate(15 38 18)"/>
      <ellipse class="f" cx="38" cy="19" rx="5" ry="7" transform="rotate(15 38 19)"/>
      <path d="M30 48l-8-5M30 40l-8-6M31 32l-7-7M31 46l9-3M32 38l9-4"/>`,
    diya: `
      <path d="M8 40c4 12 44 12 48 0z"/>
      <path class="f" d="M32 36c-6-6-4-14 0-22 4 8 6 16 0 22z"/>
      <path d="M26 54h12"/>`,
    elephant: `
      <path d="M10 50V34c0-10 8-16 18-16h10c8 0 13 6 13 13v7c0 4 2 7 6 7 2 0 2 4-1 4"/>
      <path d="M44 50v-6M14 50v6h7v-6M36 50v6h8v-6M21 50h15"/>
      <path class="f" d="M36 22c-6 0-8 4-8 9s3 8 8 8c3-3 4-14 0-17z"/>
      <path d="M50 40c-3 3-7 3-10 1"/>
      <circle cx="45" cy="28" r="1.5" fill="currentColor"/>`,
    indiaGate: `
      <path d="M14 58V24h36v34M22 58V38a10 10 0 0 1 20 0v20"/>
      <path d="M10 24h44M12 18h40v6M20 18v-4h24v4M27 14v-4h10v4"/>
      <rect class="f" x="26" y="28" width="12" height="4"/>
      <path d="M6 58h52"/>`,

    /* Italy · Capiche */
    colosseum: `
      <path d="M6 54V22c8-6 18-8 26-8 9 0 18 2 26 8v32"/>
      <path d="M6 54h52M6 32h52M6 43h52"/>
      <path d="M11 54v-5a2.5 2.5 0 0 1 5 0v5M21 54v-5a2.5 2.5 0 0 1 5 0v5M31 54v-5a2.5 2.5 0 0 1 5 0v5M41 54v-5a2.5 2.5 0 0 1 5 0v5M50 54v-5a2.5 2.5 0 0 1 5 0v5"/>
      <path d="M11 43v-5a2.5 2.5 0 0 1 5 0v5M21 43v-5a2.5 2.5 0 0 1 5 0v5M31 43v-5a2.5 2.5 0 0 1 5 0v5M41 43v-5a2.5 2.5 0 0 1 5 0v5M50 43v-5a2.5 2.5 0 0 1 5 0v5"/>
      <rect class="f" x="10" y="23" width="44" height="5"/>`,
    pisa: `
      <g transform="rotate(9 32 58)">
        <rect x="24" y="12" width="16" height="44" rx="1"/>
        <path d="M24 20h16M24 28h16M24 36h16M24 44h16M28 12V8h8v4"/>
        <path d="M28 24v0M32 24v0M36 24v0M28 32v0M32 32v0M36 32v0M28 40v0M32 40v0M36 40v0M28 50v0M32 50v0M36 50v0"/>
      </g>
      <path d="M12 58h40"/>`,
    gondola: `
      <path d="M4 38c10 12 44 12 56-6-12 8-44 8-56 6z"/>
      <path d="M58 32l3-7M57 28h5"/>
      <circle cx="40" cy="12" r="3"/>
      <rect class="f" x="37" y="17" width="6" height="7"/>
      <path d="M40 15v15M40 30l-4 7M40 30l4 7M50 6L30 48"/>
      <path d="M8 54c4-2 8-2 12 0s8 2 12 0 8-2 12 0 8 2 12 0"/>`,
    vespa: `
      <circle cx="16" cy="48" r="6"/><circle cx="48" cy="48" r="6"/>
      <path class="f" d="M8 46c0-9 7-14 16-14h10l4 10h4v4H8z"/>
      <path d="M44 42l-6-22h6M37 20h9M18 29h12"/>`,
    olive: `
      <path d="M10 56C22 42 36 28 56 8"/>
      <ellipse cx="14" cy="45" rx="7" ry="2.8" transform="rotate(-80 14 45)"/>
      <ellipse cx="26" cy="46" rx="7" ry="2.8" transform="rotate(10 26 46)"/>
      <ellipse cx="26" cy="31" rx="7" ry="2.8" transform="rotate(-80 26 31)"/>
      <ellipse cx="40" cy="32" rx="7" ry="2.8" transform="rotate(10 40 32)"/>
      <ellipse cx="40" cy="16" rx="7" ry="2.8" transform="rotate(-80 40 16)"/>
      <circle class="f" cx="33" cy="40" r="3.5"/><circle class="f" cx="48" cy="25" r="3.5"/>`,
    mask: `
      <path d="M6 22c8-4 18-4 26 4 8-8 18-8 26-4 0 14-6 22-14 22-6 0-8-6-12-6s-6 6-12 6C12 44 6 36 6 22z"/>
      <path class="f" d="M14 28c3-2 7-2 10 1-3 3-7 3-10-1zM40 29c3-3 7-3 10-1-3 4-7 4-10 1z"/>
      <path d="M58 22c3-6 1-12-4-16"/>`,
  },

  // which icons each brand brings; cycled to fill its slots
  sets: {
    aiko: ['seoulTower', 'palace', 'taegeuk', 'mugunghwa', 'lantern', 'fan'],
    capiche: ['colosseum', 'pisa', 'gondola', 'vespa', 'olive', 'mask'],
    beshak: ['tajMahal', 'lotus', 'peacock', 'diya', 'elephant', 'indiaGate', 'lotus', 'peacock'],
  },

  // Aiko's side as [x%, y%] of the stage; Capiche mirrors it on the right.
  // Beshak's icons ring the mandala behind the title (placed in intro.js).
  layout: {
    landscape: [[5, 8], [17, 6], [10, 21], [20, 27], [4, 44], [8, 72], [20, 82], [4, 92], [31, 95]],
    portrait: [[8, 8], [30, 4], [26, 13], [10, 21], [7, 34], [10, 80], [28, 87], [9, 94], [30, 96]],
  },
};

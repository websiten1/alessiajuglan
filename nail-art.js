/* =====================================================
   Nail art — high quality SVG close-ups of a single nail.
   Classic luxury aesthetic: refined almond shape, realistic
   cuticle, layered gradients, specular shine, subtle grain.
   ===================================================== */
(function () {
  // Shared definitions used by every nail (finger pad + cuticle).
  function commonDefs() {
    return `
      <linearGradient id="sharedSkin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ecc2a4"/>
        <stop offset="0.5" stop-color="#d99f7d"/>
        <stop offset="1" stop-color="#a47258"/>
      </linearGradient>
      <radialGradient id="sharedSkinShade" cx="0.5" cy="0.78" r="0.8">
        <stop offset="0" stop-color="rgba(95,50,30,0)"/>
        <stop offset="0.7" stop-color="rgba(95,50,30,0.15)"/>
        <stop offset="1" stop-color="rgba(95,50,30,0.45)"/>
      </radialGradient>
      <linearGradient id="sharedCuticle" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(150,90,65,0.4)"/>
        <stop offset="1" stop-color="rgba(150,90,65,0)"/>
      </linearGradient>
      <radialGradient id="sharedShine" cx="0.25" cy="0.18" r="0.6">
        <stop offset="0" stop-color="rgba(255,255,255,0.9)"/>
        <stop offset="0.5" stop-color="rgba(255,255,255,0.3)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
      <radialGradient id="sharedTipShine" cx="0.7" cy="0.75" r="0.4">
        <stop offset="0" stop-color="rgba(255,255,255,0.55)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="nailShadow" x="-20%" y="-10%" width="140%" height="120%">
        <feGaussianBlur stdDeviation="6"/>
        <feOffset dx="0" dy="8"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
        <feComposite in2="SourceGraphic" operator="out"/>
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="3"/>
        <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.06 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>
    `;
  }

  // Nail plate path (elegant almond): more refined curve than before.
  // Viewbox: 240 x 360.
  const NAIL_PATH = 'M72 155 C72 60 90 40 120 40 C150 40 168 60 168 155 L162 270 C162 298 146 306 120 306 C94 306 78 298 78 270 Z';
  const CUTICLE_PATH = 'M86 52 C95 42 145 42 154 52 C148 58 120 60 86 52 Z';

  function baseNail({ plateFill, extraDefs = '', overlay = '', shineOpacity = 0.75, grainOpacity = 0 }) {
    return `
<svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="nail-svg" role="img" aria-label="Manichiura Alessia Juglan">
  <defs>
    ${commonDefs()}
    ${extraDefs}
  </defs>

  <!-- finger pad -->
  <path d="M44 250 Q44 168 120 168 Q196 168 196 250 L196 338 Q196 360 120 360 Q44 360 44 338 Z" fill="url(#sharedSkin)"/>
  <ellipse cx="120" cy="340" rx="90" ry="22" fill="url(#sharedSkinShade)"/>

  <!-- soft under-nail shadow -->
  <ellipse cx="120" cy="300" rx="54" ry="12" fill="rgba(90,50,30,0.22)"/>

  <!-- nail plate -->
  <path d="${NAIL_PATH}" fill="${plateFill}"/>

  ${grainOpacity > 0 ? `<path d="${NAIL_PATH}" fill="#000" filter="url(#grain)" opacity="${grainOpacity}"/>` : ''}

  ${overlay}

  <!-- cuticle (painted edge line) -->
  <path d="${CUTICLE_PATH}" fill="url(#sharedCuticle)" opacity="0.7"/>
  <path d="M86 52 C95 42 145 42 154 52" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>

  <!-- specular shine (large upper-left) -->
  <ellipse cx="92" cy="110" rx="14" ry="52" fill="url(#sharedShine)" opacity="${shineOpacity}" class="nail-shine"/>
  <!-- secondary hotspot -->
  <ellipse cx="148" cy="240" rx="10" ry="24" fill="url(#sharedTipShine)" opacity="0.7"/>

  <!-- outer rim (subtle) -->
  <path d="${NAIL_PATH}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
</svg>`;
  }

  const designs = {
    // Milky pearl — soft warm white
    milky: () => baseNail({
      plateFill: 'url(#milkyP)',
      extraDefs: `
        <linearGradient id="milkyP" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#fdf7ef"/>
          <stop offset="0.5" stop-color="#f3e0cd"/>
          <stop offset="1" stop-color="#d9bfa5"/>
        </linearGradient>`,
      shineOpacity: 0.85
    }),

    // Chrome mirror — silvery metallic reflections
    chrome: () => baseNail({
      plateFill: 'url(#chromeP)',
      extraDefs: `
        <linearGradient id="chromeP" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f9f3eb"/>
          <stop offset="0.25" stop-color="#c9b6a3"/>
          <stop offset="0.45" stop-color="#eee1d0"/>
          <stop offset="0.7" stop-color="#b49d83"/>
          <stop offset="1" stop-color="#f1e2d2"/>
        </linearGradient>
        <linearGradient id="chromeBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(255,255,255,0.85)"/>
          <stop offset="1" stop-color="rgba(200,180,160,0.1)"/>
        </linearGradient>`,
      overlay: `
        <path d="M80 90 Q 110 110 120 95 Q 140 80 165 105" fill="none" stroke="url(#chromeBand)" stroke-width="3" opacity="0.5"/>
        <path d="M76 200 Q 120 225 162 200" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>`,
      shineOpacity: 0.95
    }),

    // Rose blush — dusty pink
    rose: () => baseNail({
      plateFill: 'url(#roseP)',
      extraDefs: `
        <radialGradient id="roseP" cx="0.45" cy="0.4" r="0.85">
          <stop offset="0" stop-color="#f6cfbd"/>
          <stop offset="0.5" stop-color="#d99b89"/>
          <stop offset="1" stop-color="#9d5e52"/>
        </radialGradient>`,
      shineOpacity: 0.7
    }),

    // 3D pearls — luxurious raised pearls with gold rim
    '3d': () => baseNail({
      plateFill: 'url(#nudePlate)',
      extraDefs: `
        <linearGradient id="nudePlate" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f5ddc4"/>
          <stop offset="0.5" stop-color="#e4bb9c"/>
          <stop offset="1" stop-color="#b88970"/>
        </linearGradient>
        <radialGradient id="pearlG" cx="0.32" cy="0.28" r="0.85">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.35" stop-color="#faeeda"/>
          <stop offset="0.7" stop-color="#d9bc94"/>
          <stop offset="1" stop-color="#8a6f45"/>
        </radialGradient>`,
      overlay: `
        <!-- centre large pearl -->
        <circle cx="120" cy="178" r="13" fill="url(#pearlG)" stroke="rgba(184,152,104,0.55)" stroke-width="0.6"/>
        <circle cx="115" cy="173" r="4" fill="rgba(255,255,255,0.85)"/>
        <!-- side pearls -->
        <circle cx="102" cy="195" r="8" fill="url(#pearlG)" stroke="rgba(184,152,104,0.5)" stroke-width="0.5"/>
        <circle cx="99" cy="192" r="2.5" fill="rgba(255,255,255,0.8)"/>
        <circle cx="138" cy="195" r="8" fill="url(#pearlG)" stroke="rgba(184,152,104,0.5)" stroke-width="0.5"/>
        <circle cx="135" cy="192" r="2.5" fill="rgba(255,255,255,0.8)"/>
        <!-- small cluster below -->
        <circle cx="112" cy="214" r="4.5" fill="url(#pearlG)"/>
        <circle cx="128" cy="214" r="4.5" fill="url(#pearlG)"/>
        <circle cx="120" cy="224" r="4" fill="url(#pearlG)"/>
        <circle cx="95" cy="213" r="2.8" fill="url(#pearlG)"/>
        <circle cx="145" cy="213" r="2.8" fill="url(#pearlG)"/>
        <!-- gold hairline frame -->
        <path d="M95 168 Q 120 158 145 168" fill="none" stroke="rgba(184,152,104,0.45)" stroke-width="0.7"/>`,
      shineOpacity: 0.6
    }),

    // Classic deep red
    red: () => baseNail({
      plateFill: 'url(#redP)',
      extraDefs: `
        <linearGradient id="redP" x1="0.3" y1="0" x2="0.6" y2="1">
          <stop offset="0" stop-color="#d8425a"/>
          <stop offset="0.5" stop-color="#9f1f36"/>
          <stop offset="1" stop-color="#5d0d1c"/>
        </linearGradient>`,
      shineOpacity: 0.8
    }),

    // Nude glow — warm natural
    nude: () => baseNail({
      plateFill: 'url(#nudeGlow)',
      extraDefs: `
        <linearGradient id="nudeGlow" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stop-color="#f6dbc1"/>
          <stop offset="0.5" stop-color="#e2b695"/>
          <stop offset="1" stop-color="#b78765"/>
        </linearGradient>`,
      shineOpacity: 0.75
    }),

    // Burgundy velvet — deep with matte subtlety
    burgundy: () => baseNail({
      plateFill: 'url(#burgP)',
      extraDefs: `
        <radialGradient id="burgP" cx="0.45" cy="0.3" r="0.95">
          <stop offset="0" stop-color="#7a2838"/>
          <stop offset="0.55" stop-color="#4a1221"/>
          <stop offset="1" stop-color="#1e0810"/>
        </radialGradient>`,
      shineOpacity: 0.45,
      grainOpacity: 0.18
    }),

    // Black + gold — sophisticated evening look
    black: () => baseNail({
      plateFill: 'url(#blackP)',
      extraDefs: `
        <linearGradient id="blackP" x1="0.4" y1="0" x2="0.6" y2="1">
          <stop offset="0" stop-color="#2d2521"/>
          <stop offset="0.5" stop-color="#14100d"/>
          <stop offset="1" stop-color="#050403"/>
        </linearGradient>
        <linearGradient id="goldStripeG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#5a4528"/>
          <stop offset="0.5" stop-color="#f0d4a0"/>
          <stop offset="1" stop-color="#5a4528"/>
        </linearGradient>
        <radialGradient id="goldDot" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stop-color="#faeac2"/>
          <stop offset="0.6" stop-color="#b89868"/>
          <stop offset="1" stop-color="#5a4528"/>
        </radialGradient>`,
      overlay: `
        <path d="M82 205 Q 120 220 158 205 L158 213 Q 120 228 82 213 Z" fill="url(#goldStripeG)" opacity="0.9"/>
        <circle cx="120" cy="175" r="4.5" fill="url(#goldDot)"/>
        <circle cx="100" cy="240" r="2.5" fill="url(#goldDot)"/>
        <circle cx="140" cy="240" r="2.5" fill="url(#goldDot)"/>`,
      shineOpacity: 0.4
    }),

    // Classic French — nude + crisp white smile line
    french: () => baseNail({
      plateFill: 'url(#frenchBase)',
      extraDefs: `
        <linearGradient id="frenchBase" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stop-color="#fbe4d3"/>
          <stop offset="0.6" stop-color="#eec4a9"/>
          <stop offset="1" stop-color="#c99a7c"/>
        </linearGradient>
        <linearGradient id="frenchTip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#f4eadf"/>
        </linearGradient>`,
      overlay: `
        <path d="M78 230 Q 120 262 162 230 L162 295 Q 120 302 78 295 Z" fill="url(#frenchTip)"/>
        <path d="M78 230 Q 120 262 162 230" fill="none" stroke="rgba(220,195,175,0.5)" stroke-width="0.6"/>`,
      shineOpacity: 0.8
    }),

    // Marble with gold veining — artisanal look
    marble: () => baseNail({
      plateFill: 'url(#marbleBase)',
      extraDefs: `
        <radialGradient id="marbleBase" cx="0.4" cy="0.35" r="0.95">
          <stop offset="0" stop-color="#fbf6ee"/>
          <stop offset="0.5" stop-color="#ecdec9"/>
          <stop offset="1" stop-color="#c9b49a"/>
        </radialGradient>
        <linearGradient id="marbleVein" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="rgba(184,152,104,0)"/>
          <stop offset="0.5" stop-color="rgba(184,152,104,0.85)"/>
          <stop offset="1" stop-color="rgba(184,152,104,0)"/>
        </linearGradient>`,
      overlay: `
        <path d="M80 80 Q 105 140 92 180 Q 84 215 112 255" fill="none" stroke="url(#marbleVein)" stroke-width="1.4"/>
        <path d="M155 75 Q 132 115 150 158 Q 172 195 142 240" fill="none" stroke="url(#marbleVein)" stroke-width="1.2"/>
        <path d="M100 110 Q 122 140 132 170" fill="none" stroke="rgba(184,152,104,0.4)" stroke-width="0.7"/>
        <path d="M130 200 Q 118 225 105 250" fill="none" stroke="rgba(184,152,104,0.5)" stroke-width="0.7"/>
        <path d="M90 140 Q 105 145 115 140" fill="none" stroke="rgba(184,152,104,0.35)" stroke-width="0.5"/>`,
      shineOpacity: 0.75
    }),

    // Magenta chic — rich pink with dimension
    magenta: () => baseNail({
      plateFill: 'url(#magP)',
      extraDefs: `
        <linearGradient id="magP" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stop-color="#e565a0"/>
          <stop offset="0.5" stop-color="#b13772"/>
          <stop offset="1" stop-color="#6a1540"/>
        </linearGradient>`,
      shineOpacity: 0.8
    }),
  };

  function inject() {
    document.querySelectorAll('.gallery__art').forEach((el) => {
      if (el.dataset.nailInjected) return;
      const m = Array.from(el.classList).find((c) => c.startsWith('gallery__art--'));
      if (!m) return;
      const key = m.replace('gallery__art--', '');
      const gen = designs[key];
      if (!gen) return;
      el.innerHTML = gen();
      el.dataset.nailInjected = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  window.AJ = window.AJ || {};
  window.AJ.nailArt = { designs, inject };
})();

/* =====================================================
   Nail art SVG illustrations — one close-up nail per card
   Each generator returns a full <svg> string that fills
   the gallery__art container. Designed to look luxe, real.
   ===================================================== */
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  // Reusable base nail + finger template. Accepts inner content
  // (the painted design) to overlay on the nail plate.
  function baseNail({ cuticleColor = '#e8b89a', skinColor = '#e6b89a', plate, overlay = '', shineColor = 'rgba(255,255,255,0.55)', plateStroke = 'rgba(0,0,0,0.08)', extraDefs = '' } = {}) {
    return `
<svg viewBox="0 0 240 340" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="nail-svg" role="img" aria-label="Manichiura Alessia Juglan">
  <defs>
    <linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skinColor}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="${skinColor}" stop-opacity="0.6"/>
    </linearGradient>
    <radialGradient id="skinShade" cx="0.5" cy="0.9" r="0.7">
      <stop offset="0" stop-color="rgba(140,90,70,0.35)"/>
      <stop offset="1" stop-color="rgba(140,90,70,0)"/>
    </radialGradient>
    <linearGradient id="shineG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${shineColor}"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    ${extraDefs}
  </defs>

  <!-- finger/pad behind nail -->
  <path d="M40 250 Q40 160 120 160 Q200 160 200 250 L200 330 Q200 360 120 360 Q40 360 40 330 Z" fill="url(#skinG)"/>
  <ellipse cx="120" cy="330" rx="95" ry="30" fill="url(#skinShade)"/>
  <!-- cuticle shadow -->
  <ellipse cx="120" cy="170" rx="55" ry="6" fill="${cuticleColor}" opacity="0.6"/>

  <!-- nail plate -->
  <path d="M65 145 Q65 45 120 45 Q175 45 175 145 L170 275 Q170 300 120 302 Q70 300 70 275 Z"
        fill="${plate}" stroke="${plateStroke}" stroke-width="0.7"/>

  ${overlay}

  <!-- specular highlight on nail -->
  <path class="nail-shine" d="M82 80 Q78 140 85 220 Q95 200 94 140 Q95 85 92 65 Q87 68 82 80 Z" fill="url(#shineG)" opacity="0.7"/>
  <!-- cuticle highlight -->
  <ellipse cx="120" cy="52" rx="40" ry="4" fill="rgba(255,255,255,0.4)"/>
</svg>`;
  }

  const designs = {
    // --- Milky / soft white pearl ---
    milky: () => baseNail({
      plate: 'url(#milkyPlate)',
      extraDefs: `
        <linearGradient id="milkyPlate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fcf5ee"/>
          <stop offset="0.5" stop-color="#f4e3d3"/>
          <stop offset="1" stop-color="#e8cfb8"/>
        </linearGradient>`,
      shineColor: 'rgba(255,255,255,0.75)'
    }),

    // --- Chrome / mirror French ---
    chrome: () => baseNail({
      skinColor: '#d9a78a',
      cuticleColor: '#c89378',
      plate: 'url(#chromePlate)',
      extraDefs: `
        <linearGradient id="chromePlate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f5f0ea"/>
          <stop offset="0.25" stop-color="#d8c9b8"/>
          <stop offset="0.5" stop-color="#efe6dc"/>
          <stop offset="0.75" stop-color="#c9b7a3"/>
          <stop offset="1" stop-color="#e8dccc"/>
        </linearGradient>
        <linearGradient id="chromeBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(255,255,255,0.8)"/>
          <stop offset="1" stop-color="rgba(200,180,160,0.2)"/>
        </linearGradient>`,
      overlay: `
        <path d="M70 50 Q 75 60 95 55 Q 120 48 145 55 Q 165 60 170 50" fill="none" stroke="url(#chromeBand)" stroke-width="3" opacity="0.5"/>
        <path d="M70 240 Q 120 280 170 240 L170 270 Q 120 300 70 270 Z" fill="rgba(255,255,255,0.45)"/>`,
      shineColor: 'rgba(255,255,255,0.95)'
    }),

    // --- Rose blush ---
    rose: () => baseNail({
      plate: 'url(#roseP)',
      extraDefs: `
        <radialGradient id="roseP" cx="0.5" cy="0.4" r="0.8">
          <stop offset="0" stop-color="#f9d8cc"/>
          <stop offset="0.6" stop-color="#ecb5a0"/>
          <stop offset="1" stop-color="#c98878"/>
        </radialGradient>`,
      shineColor: 'rgba(255,230,220,0.8)'
    }),

    // --- 3D hand painted — raised dots + rhinestones ---
    '3d': () => baseNail({
      skinColor: '#d9a78a',
      cuticleColor: '#c48c72',
      plate: 'url(#nudeP)',
      extraDefs: `
        <linearGradient id="nudeP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f4ddc8"/>
          <stop offset="1" stop-color="#e0bb9e"/>
        </linearGradient>
        <radialGradient id="gem" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.4" stop-color="#f9e8c4"/>
          <stop offset="1" stop-color="#b89868"/>
        </radialGradient>`,
      overlay: `
        <!-- pearls arranged as a small cluster -->
        <circle cx="120" cy="170" r="9" fill="url(#gem)" stroke="rgba(184,152,104,0.4)" stroke-width="0.5"/>
        <circle cx="105" cy="185" r="6" fill="url(#gem)" stroke="rgba(184,152,104,0.4)" stroke-width="0.5"/>
        <circle cx="135" cy="186" r="6" fill="url(#gem)" stroke="rgba(184,152,104,0.4)" stroke-width="0.5"/>
        <circle cx="118" cy="195" r="4" fill="url(#gem)"/>
        <circle cx="95" cy="200" r="3" fill="url(#gem)"/>
        <circle cx="145" cy="200" r="3" fill="url(#gem)"/>
        <!-- tiny highlights on pearls -->
        <circle cx="117" cy="166" r="2" fill="rgba(255,255,255,0.9)"/>
        <circle cx="103" cy="182" r="1.5" fill="rgba(255,255,255,0.9)"/>
        <circle cx="133" cy="183" r="1.5" fill="rgba(255,255,255,0.9)"/>`,
      shineColor: 'rgba(255,255,255,0.55)'
    }),

    // --- Classic red ---
    red: () => baseNail({
      plate: 'url(#redP)',
      extraDefs: `
        <linearGradient id="redP" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stop-color="#e6455a"/>
          <stop offset="0.6" stop-color="#b8253d"/>
          <stop offset="1" stop-color="#7a1628"/>
        </linearGradient>`,
      shineColor: 'rgba(255,180,180,0.85)'
    }),

    // --- Warm nude glow ---
    nude: () => baseNail({
      plate: 'url(#nudeG)',
      extraDefs: `
        <linearGradient id="nudeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f5d7be"/>
          <stop offset="1" stop-color="#d9ac8c"/>
        </linearGradient>`,
      shineColor: 'rgba(255,240,225,0.75)'
    }),

    // --- Burgundy velvet ---
    burgundy: () => baseNail({
      skinColor: '#d9a78a',
      plate: 'url(#burgP)',
      extraDefs: `
        <radialGradient id="burgP" cx="0.5" cy="0.35" r="0.9">
          <stop offset="0" stop-color="#7a2838"/>
          <stop offset="0.7" stop-color="#4e1422"/>
          <stop offset="1" stop-color="#2a0a14"/>
        </radialGradient>`,
      shineColor: 'rgba(230,150,170,0.5)'
    }),

    // --- Black with gold stripe ---
    black: () => baseNail({
      skinColor: '#d9a78a',
      plate: 'url(#blackP)',
      extraDefs: `
        <linearGradient id="blackP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2a2420"/>
          <stop offset="1" stop-color="#0d0b09"/>
        </linearGradient>
        <linearGradient id="goldStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#8a6f45"/>
          <stop offset="0.5" stop-color="#f2d9a8"/>
          <stop offset="1" stop-color="#8a6f45"/>
        </linearGradient>`,
      overlay: `
        <path d="M70 180 Q120 195 170 180 L170 190 Q120 205 70 190 Z" fill="url(#goldStripe)" opacity="0.9"/>
        <circle cx="120" cy="220" r="3" fill="#f2d9a8"/>
        <circle cx="105" cy="225" r="2" fill="#b89868"/>
        <circle cx="135" cy="225" r="2" fill="#b89868"/>`,
      shineColor: 'rgba(255,255,255,0.35)'
    }),

    // --- Classic French ---
    french: () => baseNail({
      plate: 'url(#frenchBase)',
      extraDefs: `
        <linearGradient id="frenchBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fbe5d6"/>
          <stop offset="1" stop-color="#f5c9ae"/>
        </linearGradient>`,
      overlay: `
        <!-- white smile line / tip -->
        <path d="M70 235 Q120 265 170 235 L170 298 Q120 302 70 298 Z" fill="#ffffff" opacity="0.96"/>
        <path d="M70 235 Q120 265 170 235" fill="none" stroke="rgba(220,190,170,0.5)" stroke-width="0.6"/>`,
      shineColor: 'rgba(255,255,255,0.75)'
    }),

    // --- Marble with gold veins ---
    marble: () => baseNail({
      plate: 'url(#marbleP)',
      extraDefs: `
        <radialGradient id="marbleP" cx="0.4" cy="0.35" r="0.9">
          <stop offset="0" stop-color="#fbf6ef"/>
          <stop offset="0.6" stop-color="#ece0d0"/>
          <stop offset="1" stop-color="#d8c7b4"/>
        </radialGradient>
        <linearGradient id="gVein" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="rgba(184,152,104,0)"/>
          <stop offset="0.5" stop-color="rgba(184,152,104,0.8)"/>
          <stop offset="1" stop-color="rgba(184,152,104,0)"/>
        </linearGradient>`,
      overlay: `
        <path d="M78 90 Q 100 140 90 180 Q 85 210 110 250" fill="none" stroke="url(#gVein)" stroke-width="1.4"/>
        <path d="M150 70 Q 130 110 150 150 Q 170 185 140 230" fill="none" stroke="url(#gVein)" stroke-width="1.2"/>
        <path d="M100 60 Q 120 100 130 130" fill="none" stroke="rgba(184,152,104,0.5)" stroke-width="0.8"/>
        <path d="M135 200 Q 120 220 105 240" fill="none" stroke="rgba(184,152,104,0.55)" stroke-width="0.8"/>`,
      shineColor: 'rgba(255,248,240,0.8)'
    }),

    // --- Magenta chic ---
    magenta: () => baseNail({
      plate: 'url(#magP)',
      extraDefs: `
        <linearGradient id="magP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e85c9e"/>
          <stop offset="1" stop-color="#a82668"/>
        </linearGradient>`,
      shineColor: 'rgba(255,210,235,0.85)'
    }),
  };

  function inject() {
    document.querySelectorAll('.gallery__art').forEach((el) => {
      if (el.dataset.nailInjected) return;
      // find design variant from class
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

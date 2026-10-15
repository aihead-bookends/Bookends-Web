/* ==========================================================================
   Bookends Hospitality: chai intro
   Aiko and Capiche argue (Sushi! Pizza!). Beshak's tiger strolls in with chai
   on its back: "Chai?" They sip, make up and clink cups. The tiger bucks its
   tray into the air; it comes down as a giant kulhad over the two of them,
   and when it lifts they are one, Caiko, who flips up onto the tiger's back.
   The tiger carries Caiko off to the right and the title appears, ringed by
   the essence of Korea, India and Italy.

   Dev aid: add ?t=5.5 to the URL to freeze the timeline at 5.5 seconds.
   ========================================================================== */
(() => {
  'use strict';

  const stage = document.getElementById('stage');
  const scene = document.getElementById('scene');
  const fx = stage.querySelector('.fx');
  const bg = document.getElementById('bg');
  const title = stage.querySelector('.title h1');
  const sub = stage.querySelector('.brands');
  const replayBtn = stage.querySelector('.replay');
  const skipBtn = stage.querySelector('.skip');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const portrait = window.matchMedia('(max-aspect-ratio: 4/5)');
  const ESSENCE = window.BOOKENDS_ESSENCE;
  const SOUND = window.BOOKENDS_SOUND;     // js/sound.js: music and effects for the intro
  let quietCues = false;                    // true while skipping, so jumped-over cues stay silent
  const sfx = (...args) => { if (!quietCues && SOUND) SOUND.fx(...args); };
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const pair = (str, fallback) => (str || fallback).split(' ').map(Number);

  const char = (name) => {
    const root = stage.querySelector(`[data-char="${name}"]`);
    return {
      root,
      lift: root.querySelector('.char__lift'),
      body: root.querySelector('.char__body'),
      img: root.querySelector('img:not(.rider):not(.rig):not(.rig-head__part)'),
      rider: root.querySelector('.rider'),
      parts: Object.fromEntries([...root.querySelectorAll('[data-part]')].map((el) => [el.dataset.part, el])),
      shadow: root.querySelector('.char__shadow'),
    };
  };
  const A = char('aiko');
  const C = char('capiche');
  const T = char('tiger');
  const LEGS = ['leg-hind-near', 'leg-hind-far', 'leg-fore-far', 'leg-fore-near'].map((n) => T.parts[n]);
  const [hindNear, hindFar, foreFar, foreNear] = LEGS;
  const tail = T.parts.tail;
  const head = T.parts['head-rig'];
  const jaw = T.parts.jaw;
  const tongue = T.parts.tongue;
  const ear = T.parts.ear;
  const lidL = T.parts['lid-l'];
  const lidR = T.parts['lid-r'];
  const RIG = Object.values(T.parts);

  /* --- placeholder art, used if a PNG is missing from /assets -------------- */

  const cssVar = (name, fallback) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const INK = cssVar('--ink', '#111111');
  const PAPER = cssVar('--paper-light', '#FBF6EC');

  const svgURI = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

  const PLACEHOLDERS = {
    none: () => 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    aiko: () => svgURI(`<svg xmlns="http://www.w3.org/2000/svg" width="84" height="128" viewBox="0 0 84 128">
      <circle cx="40" cy="17" r="13" fill="${INK}"/>
      <g fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M39 34 37 76"/><path d="M38 44 58 52 70 38"/><path d="M38 46 24 60 38 64"/>
        <path d="M37 76 22 121"/><path d="M37 76 56 98 60 121"/>
      </g></svg>`),
    generic: (name) => svgURI(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" viewBox="0 0 240 120">
      <rect x="4" y="4" width="232" height="112" rx="56" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>
      <text x="120" y="68" font-family="Georgia, serif" font-size="26" font-weight="700" text-anchor="middle" fill="${INK}">${name}</text>
    </svg>`),
  };

  function loadImage(img) {
    const name = img.dataset.placeholder || img.closest('[data-char]').dataset.char;
    return new Promise((resolve) => {
      let tries = 0;
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', function onError() {
        tries += 1;
        if (tries === 1) {                      // one retry for a dropped request
          img.src = `${img.dataset.src}?retry=1`;
          return;
        }
        img.removeEventListener('error', onError);
        console.info(`[intro] ${img.dataset.src} not found, using placeholder art.`);
        img.src = PLACEHOLDERS[name] ? PLACEHOLDERS[name]() : PLACEHOLDERS.generic(name);
      });
      img.src = img.dataset.src;
    });
  }

  /* --- the chai things ------------------------------------------------------ */

  const ART = {
    // a brass tray with a chai kettle on its left half (the cups are separate, so they can be handed out)
    chaiTray: `<svg viewBox="0 0 120 64" stroke="#111" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      <path d="M40 32c8-2 12-10 16-19" fill="none" stroke-width="6.5"/>
      <path d="M40 32c8-2 12-10 16-19" fill="none" stroke="#D8CFBE" stroke-width="2.6"/>
      <path d="M13 28c-9 2-9 15 0 17" fill="none" stroke-width="3.6"/>
      <path d="M15 20h26c4 10 4 26-2 34H17c-6-8-6-24-2-34z" fill="#D8CFBE"/>
      <path d="M19 20c2-7 18-7 20 0z" fill="#B9AE98"/>
      <circle cx="29" cy="12" r="2.6" fill="#111"/>
      <ellipse cx="60" cy="56" rx="56" ry="6" fill="#E9A23B"/></svg>`,
    // a clay chai cup
    kulhad: `<svg viewBox="0 0 40 44" stroke="#111" stroke-width="2.6" stroke-linejoin="round">
      <path d="M4 9l5 31h22l5-31z" fill="#C8553D"/>
      <path d="M9 21h22" fill="none" stroke="#E9A27E" stroke-width="2"/>
      <ellipse cx="20" cy="9" rx="16" ry="4.5" fill="#C99A62"/></svg>`,
    // a giant kulhad, upside down: it comes down over the two of them like a magician's cup
    bigKulhad: `<svg viewBox="0 0 100 112" stroke="#111" stroke-width="3" stroke-linejoin="round">
      <path d="M24 8h52l18 96H6z" fill="#C8553D"/>
      <path d="M24 8c0-7 52-7 52 0z" fill="#A8432F"/>
      <path d="M18 40h64M12 74h76" fill="none" stroke="#E9A27E" stroke-width="3"/>
      <path d="M28 57l7-7 7 7 7-7 7 7 7-7 7 7" fill="none" stroke="#F3E3C3" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="50" cy="104" rx="44" ry="5" fill="#8E3A28"/></svg>`,
    steam: `<svg viewBox="0 0 20 60" fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round" opacity=".45">
      <path d="M10 58c-8-8 8-14 0-22s8-14 0-22 6-10 0-14"/></svg>`,
    // the spark when the cups clink
    spark: `<svg viewBox="0 0 100 100"><polygon points="50,2 60,36 98,30 68,54 88,96 50,70 12,96 32,54 2,30 40,36"
      fill="#FFF7C2" stroke="#111" stroke-width="3" stroke-linejoin="round"/></svg>`,
  };
  const RING_ANGLES = [-150, -110, -70, -30, 30, 70, 110, 150]; // Indian icons around the title

  /* --- effect elements ------------------------------------------------------- */

  let dust, hearts, icons, mandala;

  function make(cls, html = '', parent = fx) {
    const el = document.createElement('span');
    el.className = cls;
    el.innerHTML = html;
    parent.appendChild(el);
    return el;
  }

  // props (cups, steam, words…) are made fresh on every build and cleared on the next
  let props = [];
  function removeProps() {
    props.forEach((el) => el.remove());
    props = [];
  }
  // a loose prop on the effects layer, positioned by its centre with x/y
  function prop(cls, html, width) {
    const el = make(`prop ${cls}`, html);
    if (width) el.style.width = `${width}px`;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    props.push(el);
    return el;
  }
  // something a character carries: moves, squashes and spins with it
  function held(ch, cls, html, { width, left, top }) {
    const el = document.createElement('span');
    el.className = `held ${cls}`;
    el.innerHTML = html;
    Object.assign(el.style, { width: `${width}px`, left: `${left}px`, top: `${top}px` });
    ch.body.appendChild(el);
    props.push(el);
    return el;
  }

  const iconSVG = (name) =>
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${ESSENCE.icons[name]}</svg>`;

  function createFx() {
    dust = Array.from({ length: 8 }, () => make('dust'));
    hearts = [0, 1, 2].map(() => make('heart', '♥'));

    // the background: each country's icons float on their own, forever
    mandala = make('mandala', ESSENCE.mandala(), bg);
    if (!reduceMotion) gsap.to(mandala.firstElementChild, { rotation: 360, duration: 120, ease: 'none', repeat: -1 });

    const slots = ESSENCE.layout.landscape.length;
    icons = {};
    for (const [brand, count] of [['aiko', slots], ['capiche', slots], ['beshak', RING_ANGLES.length]]) {
      const set = ESSENCE.sets[brand];
      icons[brand] = Array.from({ length: count }, (_, i) => {
        const el = make(`doodle doodle--${brand}`, iconSVG(set[i % set.length]), bg);
        el.style.setProperty('--s', brand === 'beshak' ? 1 : gsap.utils.random(0.85, 1.15).toFixed(2));
        const art = el.firstElementChild;
        const tilt = gsap.utils.random(-12, 12);
        gsap.set(art, { rotation: tilt });
        if (!reduceMotion) {
          gsap.to(art, {
            y: -gsap.utils.random(4, 9),
            rotation: tilt + gsap.utils.random(-6, 6),
            duration: gsap.utils.random(2.2, 3.6),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: gsap.utils.random(0, 2),
          });
        }
        return el;
      });
    }
  }

  /* --- motion helpers ------------------------------------------------------ */

  function squash(ch, amt = 0.2, recover = 0.5) {
    return gsap.timeline()
      .to(ch.body, { scaleX: 1 + amt, scaleY: 1 - amt, duration: 0.07, ease: 'power2.out' })
      .to(ch.body, { scaleX: 1, scaleY: 1, duration: recover, ease: 'elastic.out(1, 0.35)' });
  }

  function hopInPlace(ch, height, dur) {
    return gsap.timeline()
      .to(ch.lift, { y: -height, duration: dur / 2, ease: 'power2.out' }, 0)
      .to(ch.lift, { y: 0, duration: dur / 2, ease: 'power2.in' }, dur / 2)
      .to(ch.shadow, { scale: 0.6, opacity: 0.5, duration: dur / 2, ease: 'power2.out' }, 0)
      .to(ch.shadow, { scale: 1, opacity: 1, duration: dur / 2, ease: 'power2.in' }, dur / 2);
  }

  function hop(ch, x, dur, height) {
    return hopInPlace(ch, height, dur).to(ch.root, { x, duration: dur, ease: 'power1.inOut' }, 0);
  }

  // cut-out walk: glide forward with a bob and a rock on every step
  function walk(ch, x, steps, stepDur, bob) {
    const dur = steps * stepDur;
    return gsap.timeline()
      .to(ch.root, { x, duration: dur, ease: 'none' }, 0)
      .to(ch.lift, { y: -bob, duration: stepDur / 2, ease: 'sine.out', yoyo: true, repeat: steps * 2 - 1 }, 0)
      .fromTo(ch.body, { rotation: -1 },
        { rotation: 1, duration: stepDur, ease: 'sine.inOut', yoyo: true, repeat: steps - 1, immediateRender: false }, 0)
      .to(ch.body, { rotation: 0, duration: 0.15 }, dur);
  }

  // the tiger's legs: diagonal pairs take turns. Each leg skews from its joint line,
  // so the top stays locked to the body while the paw swings; the swinging leg
  // shortens a little mid-stride, which lifts the paw. The tail sways along.
  function gait(steps, stepDur, settleHead = true) {
    const t = gsap.timeline();
    const pairs = [[hindNear, foreFar], [hindFar, foreNear]];
    for (let i = 0; i < steps; i++) {
      const [swing, stance] = i % 2 ? [pairs[1], pairs[0]] : [pairs[0], pairs[1]];
      const at = i * stepDur;
      t.to(swing, { skewX: 14, duration: stepDur, ease: 'sine.inOut' }, at)
        .to(swing, { scaleY: 0.9, duration: stepDur / 2, ease: 'sine.out', yoyo: true, repeat: 1 }, at)
        .to(stance, { skewX: -12, duration: stepDur, ease: 'sine.inOut' }, at)
        .to(head, { rotation: i % 2 ? -2.5 : 2.5, duration: stepDur, ease: 'sine.inOut' }, at);
    }
    const end = steps * stepDur;
    if (settleHead) t.to(head, { rotation: 0, duration: 0.25 }, end);
    return t.to(LEGS, { skewX: 0, scaleY: 1, duration: 0.25, ease: 'sine.out' }, end)
      .fromTo(tail, { rotation: -6 }, { rotation: 6, duration: stepDur, ease: 'sine.inOut', yoyo: true, repeat: steps - 1, immediateRender: false }, 0)
      .to(tail, { rotation: 0, duration: 0.2 }, end);
  }

  // random jitter on the whole scene, fading out
  function shake(strength, dur) {
    const t = gsap.timeline();
    const steps = Math.max(3, Math.round(dur / 0.045));
    for (let i = 0; i < steps; i++) {
      const k = strength * (1 - i / steps);
      t.to(scene, {
        x: gsap.utils.random(-k, k),
        y: gsap.utils.random(-k, k),
        rotation: gsap.utils.random(-k, k) * 0.06,
        duration: 0.045,
        ease: 'none',
      });
    }
    return t.to(scene, { x: 0, y: 0, rotation: 0, duration: 0.06, ease: 'power1.out' });
  }

  function dustPuff(x0, y0, spread) {
    const t = gsap.timeline();
    dust.forEach((d, i) => {
      const side = i % 2 ? 1 : -1;
      t.fromTo(d, { x: x0, y: y0, scale: 0.3, autoAlpha: 1 }, {
        x: x0 + side * spread * gsap.utils.random(0.5, 1.05),
        y: y0 - gsap.utils.random(4, 28),
        scale: gsap.utils.random(0.9, 1.6),
        autoAlpha: 0,
        duration: gsap.utils.random(0.5, 0.8),
        ease: 'power2.out',
        immediateRender: false,
      }, 0);
    });
    return t;
  }

  function heartsUp(x0, y0, reach) {
    const t = gsap.timeline();
    hearts.forEach((h, i) => {
      const dx = (i - 1) * reach * 0.5;
      t.fromTo(h, { x: x0, y: y0, scale: 0.2, autoAlpha: 1 }, {
        x: x0 + dx,
        y: y0 - reach * gsap.utils.random(0.8, 1.1),
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        immediateRender: false,
      }, i * 0.12)
        .to(h, { autoAlpha: 0, duration: 0.3 }, i * 0.12 + 0.7);
    });
    return t;
  }

  /* --- geometry ------------------------------------------------------------ */

  function measure() {
    // measured from the inner layer, which drifts with the scroll-away fade (home.js)
    const s = (document.getElementById('stage-inner') || stage).getBoundingClientRect();
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - s.left + r.width / 2, top: r.top - s.top, bottom: r.bottom - s.top, w: r.width, h: r.height };
    };
    const parts = [title, sub, replayBtn].map(box);
    const top = Math.min(...parts.map((p) => p.top));
    const bottom = Math.max(...parts.map((p) => p.bottom));
    const halfW = Math.max(...parts.map((p) => p.w)) / 2;
    return {
      W: s.width, H: s.height, a: box(A.img), c: box(C.img), t: box(T.img),
      title: { top, bottom, cy: (top + bottom) / 2, halfW, halfH: (bottom - top) / 2 },
    };
  }

  /* --- the timeline -------------------------------------------------------- */

  let tl;

  // a word or two popping up over the stage
  function say(text, at, x, y, hold = 0.55, cls = 'say') {
    const el = prop(cls, text);
    tl.fromTo(el, { x, y, autoAlpha: 1, scale: 0, rotation: -12 },
      { scale: 1, rotation: 0, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, at)
      .to(el, { autoAlpha: 0, scale: 1.25, duration: 0.22, ease: 'power2.in' }, at + 0.3 + hold);
    return el;
  }

  // something tossed from one point to another in an arc
  function arc(el, from, to, at, dur, height, spin = 0) {
    tl.fromTo(el, { x: from.x }, { x: to.x, duration: dur, ease: 'none', immediateRender: false }, at)
      .fromTo(el, { y: from.y }, {
        keyframes: [
          { y: Math.min(from.y, to.y) - height, duration: dur / 2, ease: 'power2.out' },
          { y: to.y, duration: dur / 2, ease: 'power2.in' },
        ],
        immediateRender: false,
      }, at);
    if (spin) tl.fromTo(el, { rotation: 0 }, { rotation: spin, duration: dur, ease: 'none', immediateRender: false }, at);
  }

  const gone = (els, at) => tl.to(els, { autoAlpha: 0, scale: 0.4, duration: 0.2, ease: 'power2.in' }, at);

  // the tiger's eyes shut / open (both, 'left' or 'right')
  function eyes(at, state, which = 'both') {
    const els = which === 'left' ? [lidL] : which === 'right' ? [lidR] : [lidL, lidR];
    tl.set(els, { autoAlpha: state === 'shut' ? 1 : 0 }, at);
  }

  function wink(at) {
    eyes(at, 'shut', 'right');
    eyes(at + 0.3, 'open', 'right');
    tl.to(head, { rotation: 4, duration: 0.15, yoyo: true, repeat: 1 }, at);
  }

  function build() {
    if (tl) tl.kill();
    removeProps();

    const korean = icons.aiko;
    const italian = icons.capiche;
    const indian = icons.beshak;

    // measure the CSS resting layout with no transforms applied
    gsap.set([scene, mandala, title, sub, replayBtn, ...korean, ...italian, ...indian,
      ...[A, C, T].flatMap((c) => [c.root, c.lift, c.body, c.shadow, c.rider]).filter(Boolean), ...RIG],
    { clearProps: 'transform,opacity,visibility' });
    RIG.filter((part) => part.dataset.pivot).forEach((part) => {
      const [px, py] = pair(part.dataset.pivot, '0.5 0.5');
      gsap.set(part, { transformOrigin: `${px * 100}% ${py * 100}%` });
    });
    const m = measure();
    const { W, H } = m;
    const cx = W / 2;
    const floorY = m.t.bottom;
    const fh = Math.max(m.a.h, m.c.h);
    const tw = m.t.w;
    const th = m.t.h;

    // characters: x targets are absolute stage px, converted to offsets from each resting spot
    const ax = (px) => px - m.a.x;
    const cxo = (px) => px - m.c.x;
    const tx = (px) => px - cx; // tiger offsets are from the stage centre
    const aOff = ax(-m.a.w);
    const cOff = cxo(W + m.c.w);

    // they argue a little right of centre, leaving room for the tiger on the left
    const pc = cx + W * 0.12;
    const aSt = ax(pc - W * 0.1);
    const cSt = cxo(pc + W * 0.1);
    const aAt = (off) => m.a.x + off;           // stage x of Aiko's centre for a root offset
    const cAt = (off) => m.c.x + off;
    const tcx = Math.max(tw / 2 + 12, aAt(aSt) - m.a.w / 2 - tw / 2 - W * 0.03);
    const exitCx = W + tw * 0.75 + 40;
    // where they hold things: Aiko's right hand (arm end), Capiche's left lobe
    const hands = [
      { x: aAt(aSt) + m.a.w * 0.46, y: m.a.top + m.a.h * 0.64 },
      { x: cAt(cSt) - m.c.w * 0.44, y: m.c.top + m.c.h * 0.55 },
    ];
    // the tiger's head, for what it says
    const ht = { x: tcx - tw / 2 + tw * 0.9, y: m.t.top + th * 0.02 };

    // Caiko sits on the saddle: data-saddle (on the tiger) meets data-seat (on Caiko)
    const [saddleX, saddleY] = pair(T.img.dataset.saddle, '0.45 0.15');
    const [seatX, seatY] = pair(T.rider.dataset.seat, '0.5 0.8');
    const rw = T.rider.offsetWidth;
    const rh = T.rider.offsetHeight;
    const riderLeft = saddleX * tw - seatX * rw;
    const riderTop = saddleY * th - seatY * rh;
    Object.assign(T.rider.style, { left: `${riderLeft}px`, top: `${riderTop}px` });
    const saddle = { x: tcx - tw / 2 + riderLeft + rw * seatX, y: m.t.top + riderTop + rh * seatY };

    // background: Korea on Aiko's side, Italy mirrored on Capiche's side,
    // India ringing a mandala behind the title
    const slots = portrait.matches ? ESSENCE.layout.portrait : ESSENCE.layout.landscape;
    slots.forEach(([x, y], i) => {
      Object.assign(korean[i].style, { left: `${x}%`, top: `${y}%` });
      Object.assign(italian[i].style, { left: `${100 - x}%`, top: `${y}%` });
    });
    const ms = Math.min(W, H) * 0.66;
    const size = indian[0].offsetWidth;
    const ringR = (ms / 2) * 1.12;
    const clearX = m.title.halfW + size / 2 + 10;
    const clearY = m.title.halfH + size / 2 + 10;
    const indianPos = indian.map((el, i) => {
      const a = RING_ANGLES[i] * Math.PI / 180;
      let px = cx + Math.cos(a) * ringR * (portrait.matches ? 1 : 1.25);
      let py = m.title.cy + Math.sin(a) * ringR;
      // keep the title readable: push icons that land on it above or below it
      if (Math.abs(px - cx) < clearX && Math.abs(py - m.title.cy) < clearY) {
        py = m.title.cy + Math.sign(Math.sin(a)) * clearY;
      }
      px = gsap.utils.clamp(size / 2 + 6, W - size / 2 - 6, px);
      py = gsap.utils.clamp(size / 2 + 6, H - size / 2 - 6, py);
      Object.assign(el.style, { left: `${px}px`, top: `${py}px` });
      return { x: px, y: py };
    });

    // starting state: the two off the edges, the tiger off to the left, ready to stroll in
    gsap.set(A.root, { x: aOff });
    gsap.set(C.root, { x: cOff });
    gsap.set(T.root, { x: tx(-tw * 0.6) });
    gsap.set(T.lift, { y: 0, autoAlpha: 1 });
    gsap.set(T.shadow, { scale: 1, opacity: 1 });
    gsap.set([...dust, ...hearts], { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 1, rotation: 0 });
    gsap.set([...korean, ...italian, ...indian], { scale: 0, autoAlpha: 0 });
    gsap.set(mandala, { left: cx, top: m.title.cy, width: ms, height: ms, xPercent: -50, yPercent: -50, scale: 0.3, autoAlpha: 0 });
    gsap.set(T.rider, { transformOrigin: '50% 100%' });
    gsap.set([title, sub, replayBtn], { autoAlpha: 0, y: 18 });
    gsap.set(skipBtn, { autoAlpha: 1 });

    // when things happen (seconds)
    const SHOUTS = [1.3, 1.7, 2.1, 2.5];   // Sushi! Pizza! SUSHI!! PIZZA!!
    const NOSE = 2.95;                     // nose to nose
    const STROLL = 1.3;                    // the tiger walks in…
    const STROLL_STEP = 0.34;
    const STROLL_STEPS = 7;
    const ARRIVE = STROLL + STROLL_STEPS * STROLL_STEP;
    const ASK = ARRIVE + 0.25;             // "Chai?"
    const YES = ARRIVE + 1.0;              // "Chai!!"
    const SERVE = YES + 0.45;              // a cup each, off the tray
    const SIP = SERVE + 0.8;
    const MAKEUP = SIP + 1.1;
    const CHEERS = MAKEUP + 0.7;
    const CLINK = CHEERS + 0.35;
    const FLIP = CLINK + 0.65;             // the tray flies up…
    const SWAP = FLIP + 0.45;              // …turns into a giant kulhad…
    const LAND = SWAP + 0.53;              // …and lands over them
    const LIFT = LAND + 1.05;              // "Ta-da!": Caiko
    const HOP = LIFT + 0.5;                // Caiko flips onto the tiger's back
    const HOP_DUR = 0.6;
    const SEAT = HOP + HOP_DUR;
    const EXIT = SEAT + 0.45;
    const EXIT_STEP = 0.34;
    const exitSteps = gsap.utils.clamp(5, 9, Math.ceil((exitCx - tcx) / (tw * 0.3)));
    const END = EXIT + exitSteps * EXIT_STEP;
    const TITLE = EXIT + (END - EXIT) * 0.55;

    tl = gsap.timeline({ paused: true, onComplete: () => document.dispatchEvent(new Event('intro:done')) });

    // the tiger's mouth, opening and shutting once per word
    function chomp(at, times = 1) {
      for (let i = 0; i < times; i++) {
        const t0 = at + i * 0.22;
        tl.to(jaw, { y: th * 0.045, duration: 0.08, ease: 'power2.out' }, t0)
          .to(tongue, { y: th * 0.022, duration: 0.08, ease: 'power2.out' }, t0)
          .to([jaw, tongue], { y: 0, duration: 0.1, ease: 'power2.in' }, t0 + 0.1);
      }
    }

    // 1 · enter: both hop in from the edges, each bringing its country
    tl.add(hop(A, (aOff + aSt) / 2, 0.5, fh * 0.45), 0)
      .add(squash(A, 0.18, 0.4), 0.5)
      .add(hop(A, aSt, 0.42, fh * 0.25), 0.55)
      .add(squash(A, 0.14), 0.97)
      .add(hop(C, (cOff + cSt) / 2, 0.5, fh * 0.45), 0.12)
      .add(squash(C, 0.18, 0.4), 0.62)
      .add(hop(C, cSt, 0.42, fh * 0.25), 0.67)
      .add(squash(C, 0.14), 1.09)
      .to(korean, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.05 }, 0.05)
      .to(italian, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.05 }, 0.17);

    // 2 · the argument: Sushi! Pizza! SUSHI!! PIZZA!!, then nose to nose
    const shout = (text, at, isA, big = false) => {
      const ch = isA ? A : C;
      const x = isA ? aAt(aSt) - fh * 0.12 : cAt(cSt) + fh * 0.12;
      say(text, at, x, (isA ? m.a.top : m.c.top) - fh * 0.14, 0.3, big ? 'say' : 'say say--small');
      tl.add(hopInPlace(ch, fh * (big ? 0.16 : 0.09), 0.26), at)
        .to(ch.body, { rotation: isA ? 9 : -9, duration: 0.13, yoyo: true, repeat: 1 }, at);
    };
    shout('Sushi!', SHOUTS[0], true);
    shout('Pizza!', SHOUTS[1], false);
    shout('Sushi!!', SHOUTS[2], true, true);
    shout('PIZZA!!', SHOUTS[3], false, true);
    tl.to(A.root, { x: aSt + W * 0.025, duration: 0.2, ease: 'power2.out' }, NOSE)
      .to(C.root, { x: cSt - W * 0.025, duration: 0.2, ease: 'power2.out' }, NOSE)
      .to(A.body, { rotation: 12, duration: 0.2 }, NOSE)
      .to(C.body, { rotation: -12, duration: 0.2 }, NOSE)
      .to([A.lift, C.lift], { y: -fh * 0.03, duration: 0.05, yoyo: true, repeat: 9 }, NOSE + 0.15)
      .add(shake(6, 0.3), NOSE + 0.15);
    say('!@#$%', NOSE + 0.4, pc, m.a.top - fh * 0.4, 0.45);

    // 3 · meanwhile the tiger strolls in, with chai on its back: "Chai?"
    const trW = tw * 0.34;
    const trH = trW * (64 / 120);
    const trLeft = tw * 0.42 - trW / 2;
    const trTop = th * 0.18 - trH * 0.9;
    const tray = held(T, 'chai', ART.chaiTray, { width: trW, left: trLeft, top: trTop });
    const cupW = trW * 0.17;
    const cupH = cupW * 1.1;
    const onTray = [0.64, 0.84].map((f) => ({ left: trLeft + trW * f - cupW / 2, top: trTop + trH * (52 / 64) - cupH }));
    const trayCups = onTray.map((p) => held(T, 'chai', ART.kulhad, { width: cupW, ...p }));
    tl.add(walk(T, tx(tcx), STROLL_STEPS, STROLL_STEP, th * 0.035), STROLL)
      .add(gait(STROLL_STEPS, STROLL_STEP), STROLL);

    say('Chai?', ASK, ht.x, ht.y - fh * 0.15, 0.6, 'say say--ink');
    chomp(ASK);
    tl.to(ear, { rotation: 8, duration: 0.07, yoyo: true, repeat: 3 }, ASK + 0.05)
      .to([A.body, C.body], { rotation: 0, scaleY: 1.1, scaleX: 0.92, duration: 0.1 }, ASK + 0.1)
      .to([A.body, C.body], { rotation: -8, scaleY: 1, scaleX: 1, duration: 0.25 }, ASK + 0.5)
      .to(A.root, { x: aSt, duration: 0.25 }, ASK + 0.5)
      .to(C.root, { x: cSt, duration: 0.25 }, ASK + 0.5);

    say('Chai!!', YES, pc, m.a.top - fh * 0.2, 0.45);
    tl.add(hopInPlace(A, fh * 0.3, 0.4), YES)
      .add(hopInPlace(C, fh * 0.3, 0.4), YES + 0.06)
      .to([A.body, C.body], { rotation: 0, duration: 0.2 }, YES);

    // 4 · a cup each, tossed off the tray; steam, a sip… aah; they make up and the tiger purrs
    const handCupW = fh * 0.2;
    tl.to(head, { keyframes: { rotation: [-6, 0] }, duration: 0.35 }, SERVE - 0.05);
    const cups = onTray.map((p, i) => {
      const cup = prop('dish', ART.kulhad, handCupW);
      const from = { x: tcx - tw / 2 + p.left + cupW / 2, y: m.t.top + p.top + cupH / 2 };
      const to = { x: hands[i].x, y: hands[i].y - handCupW * 0.4 };
      const at = SERVE + i * 0.2;
      tl.set(trayCups[i], { autoAlpha: 0 }, at)
        .set(cup, { autoAlpha: 1, scale: cupW / handCupW }, at)
        .to(cup, { scale: 1, duration: 0.5, ease: 'power1.out' }, at);
      arc(cup, from, to, at, 0.5, fh * 0.5, 360);
      return cup;
    });

    hands.forEach((hand) => {
      for (let k = 0; k < 4; k++) {
        const wisp = prop('dish', ART.steam, handCupW * 0.35);
        const at = SIP - 0.2 + k * 0.35;
        tl.fromTo(wisp, { x: hand.x + (k % 2 ? 1 : -1) * handCupW * 0.12, y: hand.y - handCupW * 0.9, autoAlpha: 1, scale: 0.6 },
          { y: hand.y - handCupW * 2.2, scale: 1.1, autoAlpha: 0, duration: 1, ease: 'sine.out', immediateRender: false }, at);
      }
    });
    tl.to(cups[0], { rotation: -30, x: `-=${handCupW * 0.3}`, duration: 0.25, yoyo: true, repeat: 1, repeatDelay: 0.4 }, SIP)
      .to(cups[1], { rotation: 30, x: `+=${handCupW * 0.3}`, duration: 0.25, yoyo: true, repeat: 1, repeatDelay: 0.4 }, SIP + 0.1)
      .to(A.body, { rotation: -6, duration: 0.25, yoyo: true, repeat: 1, repeatDelay: 0.4 }, SIP)
      .to(C.body, { rotation: 6, duration: 0.25, yoyo: true, repeat: 1, repeatDelay: 0.4 }, SIP + 0.1);
    say('aah…', SIP + 0.75, pc, m.a.top - fh * 0.18, 0.45, 'say say--ink');

    tl.to(A.body, { rotation: 10, duration: 0.25 }, MAKEUP)
      .to(C.body, { rotation: -10, duration: 0.25 }, MAKEUP)
      .add(heartsUp(pc, m.a.top, fh * 0.8), MAKEUP + 0.15);
    // the purr: eyes shut, head rocks, tail curls
    const PURR = MAKEUP + 0.1;
    eyes(PURR, 'shut');
    tl.to(head, { keyframes: { rotation: [4, -3, 4, 0] }, duration: 1, ease: 'sine.inOut' }, PURR)
      .to(tail, { keyframes: { rotation: [-16, 10, -12, 0] }, duration: 1, ease: 'sine.inOut' }, PURR);
    eyes(PURR + 1, 'open');
    say('purrr…', PURR + 0.1, ht.x, ht.y - fh * 0.12, 0.55, 'say say--ink say--small');

    // 5 · "Cheers!" They shuffle up close and clink cups, then a last gulp
    const clinkY = Math.min(hands[0].y, hands[1].y) - handCupW * 0.6;
    tl.to([A.body, C.body], { rotation: 0, duration: 0.2 }, CHEERS)
      .add(hop(A, ax(pc - m.a.w * 0.42), 0.35, fh * 0.12), CHEERS)
      .add(hop(C, cxo(pc + m.c.w * 0.42), 0.35, fh * 0.12), CHEERS)
      .to(cups[0], { x: pc - handCupW * 0.45, y: clinkY, rotation: 20, duration: 0.35, ease: 'power2.inOut' }, CHEERS)
      .to(cups[1], { x: pc + handCupW * 0.45, y: clinkY, rotation: -20, duration: 0.35, ease: 'power2.inOut' }, CHEERS);
    const spark = prop('dish', ART.spark, fh * 0.28);
    tl.fromTo(spark, { x: pc, y: clinkY - handCupW * 0.3, autoAlpha: 1, scale: 0, rotation: -20 },
      { scale: 1, rotation: 0, duration: 0.12, ease: 'power2.out', immediateRender: false }, CLINK)
      .to(spark, { autoAlpha: 0, scale: 1.3, duration: 0.2 }, CLINK + 0.2)
      .add(shake(4, 0.15), CLINK)
      .to(cups[0], { rotation: -40, duration: 0.2 }, CLINK + 0.35)
      .to(cups[1], { rotation: 40, duration: 0.2 }, CLINK + 0.35);
    say('Cheers!', CLINK, pc, m.a.top - fh * 0.3, 0.45);
    gone(cups, CLINK + 0.6);

    // 6 · the kulhad trick: the tiger bucks its tray into the air, it turns into a
    // giant kulhad and comes down over the two of them…
    const bigW = m.a.w + m.c.w;
    const bigH = bigW * (112 / 100);
    const restY = floorY - bigH * 0.46;               // the rim sits just over the floor line, hiding their feet
    const trayAt = { x: tcx - tw / 2 + trLeft + trW / 2, y: m.t.top + trTop + trH / 2 };
    const high = { x: pc, y: restY - fh * 0.6 };
    const flying = prop('dish', ART.chaiTray, trW);
    const big = prop('dish', ART.bigKulhad, bigW);
    gsap.set(big, { transformOrigin: '50% 100%' });
    tl.add(squash(T, 0.1, 0.4), FLIP)
      .to(head, { keyframes: { rotation: [-8, 0] }, duration: 0.4 }, FLIP)
      .set(tray, { autoAlpha: 0 }, FLIP)
      .set(flying, { autoAlpha: 1 }, FLIP);
    arc(flying, trayAt, high, FLIP, 0.45, fh * 0.3, 540);
    tl.to(flying, { autoAlpha: 0, scale: 1.4, duration: 0.12 }, SWAP)
      .fromTo(big, { x: high.x, y: high.y, autoAlpha: 1, scale: 0.35, rotation: -160 },
        { scale: 1, rotation: 0, duration: 0.22, ease: 'back.out(1.6)', immediateRender: false }, SWAP)
      .to(big, { y: restY, duration: 0.28, ease: 'power3.in' }, SWAP + 0.25)
      .set([A.root, C.root], { autoAlpha: 0 }, LAND - 0.03)
      .to(big, { keyframes: [{ scaleY: 0.86, scaleX: 1.08, duration: 0.07 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }] }, LAND)
      .add(shake(11, 0.3), LAND)
      .add(dustPuff(pc, floorY, bigW * 0.6), LAND);

    // …under it the two become one: Caiko stands where they were. The cup jumps twice, steam escapes
    const stand = { x: pc - (saddle.x + rw * (0.5 - seatX)), y: floorY - (saddle.y + rh * (1 - seatY)) };
    tl.set(T.rider, { autoAlpha: 1, x: stand.x, y: stand.y }, LAND + 0.05);
    const KNOCKS = [LAND + 0.4, LAND + 0.75];
    KNOCKS.forEach((at, i) => {
      tl.to(big, {
        keyframes: [
          { y: restY - fh * 0.035, rotation: i ? 3 : -3, duration: 0.1, ease: 'power2.out' },
          { y: restY, rotation: 0, duration: 0.14, ease: 'power2.in' },
        ],
      }, at);
    });
    for (let k = 0; k < 3; k++) {
      const wisp = prop('dish', ART.steam, bigW * 0.1);
      tl.fromTo(wisp, { x: pc + (k - 1) * bigW * 0.14, y: floorY - bigH, autoAlpha: 1, scale: 0.6 },
        { y: floorY - bigH - bigW * 0.4, scale: 1.2, autoAlpha: 0, duration: 0.9, ease: 'sine.out', immediateRender: false }, LAND + 0.25 + k * 0.22);
    }
    wink(LAND + 0.45);

    // …"Ta-da!" The cup flies off, and there's Caiko…
    say('Ta-da!', LIFT - 0.15, ht.x, ht.y - fh * 0.15, 0.5, 'say say--ink');
    chomp(LIFT - 0.15, 2);
    tl.to(big, { y: restY - fh * 0.25, rotation: 12, duration: 0.2, ease: 'power2.out' }, LIFT)
      .to(big, { y: -bigH, rotation: 200, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, LIFT + 0.2)
      .fromTo(T.rider, { scaleY: 0.8, scaleX: 1.12 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)', immediateRender: false }, LIFT + 0.05)
      .add(heartsUp(pc, floorY - rh, rh * 0.7), LIFT + 0.1);

    // …who flips up onto the tiger's back; India's mandala opens behind the title
    tl.set(T.rider, { transformOrigin: '50% 50%' }, HOP)
      .to(T.rider, { x: 0, duration: HOP_DUR, ease: 'none' }, HOP)
      .to(T.rider, {
        keyframes: [
          { y: Math.min(stand.y, 0) - fh * 0.3, duration: HOP_DUR / 2, ease: 'power2.out' },
          { y: 0, duration: HOP_DUR / 2, ease: 'power2.in' },
        ],
      }, HOP)
      .to(T.rider, { rotation: -360, duration: HOP_DUR, ease: 'power1.inOut' }, HOP)
      .set(T.rider, { rotation: 0, transformOrigin: '50% 100%' }, SEAT)
      .to(T.rider, { keyframes: [{ scaleY: 0.85, scaleX: 1.1, duration: 0.07 }, { scaleY: 1, scaleX: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }] }, SEAT)
      .add(squash(T, 0.1, 0.45), SEAT)
      .add(shake(5, 0.2), SEAT)
      .to(ear, { rotation: 8, duration: 0.07, yoyo: true, repeat: 3 }, SEAT + 0.1)
      .fromTo(mandala, { scale: 0.3, rotation: -90, autoAlpha: 0 },
        { scale: 1, rotation: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out', immediateRender: false }, SEAT)
      .fromTo(indian, { x: (i) => saddle.x - indianPos[i].x, y: (i) => saddle.y - indianPos[i].y, scale: 0, autoAlpha: 0 },
        { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: { each: 0.06, from: 'center' }, immediateRender: false }, SEAT + 0.1);

    // 7 · and off they walk to the right, Caiko bobbing along; the title rises as they leave
    tl.add(walk(T, tx(exitCx), exitSteps, EXIT_STEP, th * 0.035), EXIT)
      .add(gait(exitSteps, EXIT_STEP), EXIT)
      .to(T.rider, { y: -rh * 0.05, duration: EXIT_STEP / 2, ease: 'sine.inOut', yoyo: true, repeat: exitSteps * 2 - 1 }, EXIT + 0.15)
      .set(T.root, { autoAlpha: 0 }, END)
      .to(skipBtn, { autoAlpha: 0, duration: 0.3 }, TITLE - 0.3)
      .to(title, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, TITLE)
      .to(sub, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, TITLE + 0.25)
      .to(replayBtn, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, TITLE + 0.6);

    // 8 · sound cues (js/sound.js): each plays as the playhead passes it
    const cue = (at, name, ...args) => tl.call(sfx, [name, ...args], at);
    [0.5, 0.62, 0.97, 1.09].forEach((t) => cue(t, 'hop'));          // the two land from their hops
    cue(SHOUTS[0], 'say', 'aiko-sushi');                             // Sushi!
    cue(SHOUTS[1], 'say', 'capiche-pizza');                          // Pizza!
    cue(SHOUTS[2], 'say', 'aiko-sushi', { loud: true });             // SUSHI!!
    cue(SHOUTS[3], 'say', 'capiche-pizza', { loud: true });          // PIZZA!!
    cue(NOSE + 0.4, 'babble', 'both', 5, { loud: true, fast: true }); // !@#$% (gibberish)
    for (let i = 0; i < STROLL_STEPS; i++) cue(STROLL + (i + 1) * STROLL_STEP, 'step', 0.14);
    cue(ASK, 'say', 'tiger-chai');                                   // Chai? (in Hindi)
    cue(YES, 'say', ['aiko-chai', 'capiche-chai'], { loud: true });  // Chai!!
    [0, 0.2].forEach((d) => { cue(SERVE + d, 'toss'); cue(SERVE + d + 0.5, 'tok'); });
    cue(SIP - 0.2, 'steam');
    cue(SIP + 0.05, 'slurp');
    cue(SIP + 0.75, 'say', ['aiko-aah', 'capiche-aah'], { gap: 0.1 }); // aah…
    cue(MAKEUP + 0.15, 'sparkle');
    cue(PURR, 'purr');
    cue(CHEERS + 0.35, 'hop');
    cue(CLINK, 'clink');
    cue(CLINK + 0.05, 'say', ['aiko-cheers', 'capiche-cheers'], { gap: 0.15 }); // Cheers! Cin cin!
    cue(CLINK + 0.4, 'gulp');
    cue(FLIP, 'whoosh', true);                                       // the tray flies up
    cue(SWAP, 'sparkle');                                            // …and turns into a giant kulhad
    cue(LAND, 'thunk');
    cue(LAND + 0.25, 'steam');
    KNOCKS.forEach((at) => cue(at, 'knock'));
    cue(LIFT - 0.15, 'say', 'tiger-tada');                           // Ta-da!
    cue(LIFT, 'tada');
    cue(LIFT + 0.2, 'whoosh');
    cue(HOP, 'whoosh');                                              // Caiko flips up…
    cue(SEAT, 'hop');                                                // …and lands on the tiger
    cue(SEAT + 0.05, 'sparkle');
    for (let i = 0; i < exitSteps; i++) cue(EXIT + (i + 1) * EXIT_STEP, 'step', 0.18 * (1 - (i / exitSteps) * 0.7));
    cue(TITLE - 0.4, 'music-out');
    cue(TITLE + 0.1, 'chime');

    return tl;
  }

  function play() {
    build();
    stage.classList.add('is-ready');

    if (reduceMotion) {
      tl.progress(1);
      return;
    }
    const t = parseFloat(new URLSearchParams(location.search).get('t'));
    if (Number.isFinite(t)) {
      tl.pause(t);
      return;
    }
    document.dispatchEvent(new Event('intro:start'));
    tl.play(0);
  }

  function skip() {
    if (!tl || tl.progress() === 1) return;
    document.dispatchEvent(new Event('intro:skip'));
    quietCues = true;
    tl.progress(1);
    quietCues = false;
    replayBtn.focus({ preventScroll: true });
  }

  /* --- boot ---------------------------------------------------------------- */

  async function init() {
    const rigImgs = RIG.filter((el) => el.tagName === 'IMG');
    await Promise.race([Promise.all([A.img, C.img, T.img, T.rider, ...rigImgs].map(loadImage)), wait(4000)]);
    await Promise.race([document.fonts ? document.fonts.ready : null, wait(1500)]);

    if (!window.gsap) {
      stage.classList.add('is-ready', 'no-anim');
      document.dispatchEvent(new Event('intro:done'));
      return;
    }

    createFx();
    play();

    skipBtn.addEventListener('click', skip);
    replayBtn.addEventListener('click', () => {
      build();
      document.dispatchEvent(new Event('intro:start'));
      tl.play(0);
      skipBtn.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') skip();
    });

    // on a size change, rebuild for the new layout and carry on from the same moment
    let lastSize = `${stage.clientWidth}x${stage.clientHeight}`;
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const size = `${stage.clientWidth}x${stage.clientHeight}`;
        if (size === lastSize || !tl) return;
        lastSize = size;
        const done = tl.progress() === 1;
        const time = tl.time();
        const paused = tl.paused();
        build();
        if (done) {
          quietCues = true;
          tl.progress(1);
          quietCues = false;
        } else if (paused) tl.pause(time);
        else tl.play(time);
      }, 120);
    });
  }

  init();
})();

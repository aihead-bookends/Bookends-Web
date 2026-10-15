/* ==========================================================================
   Bookends Hospitality: fight intro
   Aiko and Capiche brawl. Beshak's tiger leaps down from the top-left, walks
   up and roars; a big poof, and the two come out as one, Caiko, riding on
   the tiger's back. The tiger carries Caiko off to the right and the title
   appears, ringed by the essence of Korea, India and Italy.

   Dev aid: add ?t=5.5 to the URL to freeze the timeline at 5.5 seconds.
   ========================================================================== */
(() => {
  'use strict';

  const stage = document.getElementById('stage');
  const scene = document.getElementById('scene');
  const cloud = document.getElementById('cloud');
  const wobble = cloud.querySelector('.cloud__wobble');
  const fx = stage.querySelector('.fx');
  const bg = document.getElementById('bg');
  const bolt = stage.querySelector('.bolt');
  const title = stage.querySelector('.title h1');
  const sub = stage.querySelector('.brands');
  const replayBtn = stage.querySelector('.replay');
  const skipBtn = stage.querySelector('.skip');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const portrait = window.matchMedia('(max-aspect-ratio: 4/5)');
  const ESSENCE = window.BOOKENDS_ESSENCE;
  const OPENINGS = window.BOOKENDS_OPENINGS;
  const VARIANTS = Object.keys(OPENINGS);
  let variant = (() => {
    const v = new URLSearchParams(location.search).get('v');
    return VARIANTS.includes(v) ? v : (VARIANTS[Number(v)] || VARIANTS[0]);
  })();
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

  function starPoints(cx, cy, n, rOut, rIn) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? rIn : rOut;
      const a = Math.PI * (i / n - 0.5);
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    return pts.join(' ');
  }

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

  /* --- effect elements (created once) -------------------------------------- */

  // [x%, y%, diameter as % of cloud width]
  const PUFFS = [[50, 54, 50], [27, 60, 38], [73, 60, 38], [37, 32, 36], [63, 30, 38],
                 [15, 44, 24], [85, 44, 24], [32, 82, 28], [68, 82, 28]];
  const BITS = ['★', '!@#$', '✦', '%&!', '✶', '?!', '★', '#@!', '✦', '!!', '✶', '&%#', '★', '!?'];
  // what lands each hit: Aiko (Korean) throws sushi, Capiche (Italian) throws pizza
  const HIT_FOOD = {
    sushi: `<svg viewBox="0 0 64 64" stroke="#111" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="36" width="46" height="16" rx="8" fill="#FBF6EC"/>
      <path d="M6 36c8-12 44-12 52-2-8 5-44 7-52 2z" fill="#F08A5D"/>
      <path d="M20 30l3 7M31 28l3 8M43 29l3 7" stroke="#FCE3D2" stroke-width="2.2"/>
      <rect x="28" y="31" width="9" height="21" rx="1.5" fill="#22302A"/>
    </svg>`,
    pizza: `<svg viewBox="0 0 64 64" stroke="#111" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 58L9 14c14-7 32-7 46 0z" fill="#F6C453"/>
      <path d="M7 10c16-8 34-8 50 0" fill="none" stroke-width="9"/>
      <path d="M7 10c16-8 34-8 50 0" fill="none" stroke="#D9963B" stroke-width="5"/>
      <circle cx="32" cy="23" r="4.5" fill="#C8553D"/><circle cx="24" cy="33" r="4" fill="#C8553D"/><circle cx="37" cy="38" r="3.5" fill="#C8553D"/>
      <path d="M27 27l1 1M39 29l1 1M31 45l1 1" stroke="#3E7D44" stroke-width="3"/>
    </svg>`,
  };
  const RING_ANGLES = [-150, -110, -70, -30, 30, 70, 110, 150]; // Indian icons around the title

  let puffPairs, sushiHit, pizzaHit, bits, rings, dust, hearts, icons, mandala;

  function make(cls, html = '', parent = fx) {
    const el = document.createElement('span');
    el.className = cls;
    el.innerHTML = html;
    parent.appendChild(el);
    return el;
  }

  let props = [];
  function removeProps() {
    props.forEach((el) => el.remove());
    props = [];
  }
  // a loose prop on the effects layer, positioned by its centre with x/y
  function prop(cls, html, width, parent = fx) {
    const el = make(`prop ${cls}`, html, parent);
    if (width) el.style.width = `${width}px`;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    props.push(el);
    return el;
  }
  // something a character holds: moves, squashes and spins with it
  function held(ch, cls, html, { width, left, top, parent = ch.body }) {
    const el = document.createElement('span');
    el.className = `held ${cls}`;
    el.innerHTML = html;
    Object.assign(el.style, { width: `${width}px`, left: `${left}px`, top: `${top}px` });
    parent.appendChild(el);
    props.push(el);
    return el;
  }

  const iconSVG = (name) =>
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${ESSENCE.icons[name]}</svg>`;

  function createFx() {
    const outline = cloud.querySelector('.cloud__layer--outline');
    const fill = cloud.querySelector('.cloud__layer--fill');
    puffPairs = PUFFS.map(([x, y, d]) => [outline, fill].map((layer) => {
      const p = document.createElement('span');
      p.className = 'puff';
      p.style.cssText = `left:${x}%;top:${y}%;width:${d}%`;
      layer.appendChild(p);
      return p;
    }));
    gsap.set(puffPairs.flat(), { xPercent: -50, yPercent: -50 });

    const star = `<svg viewBox="0 0 100 100"><polygon points="${starPoints(50, 50, 12, 48, 30)}"/></svg>`;
    sushiHit = make('burst', `${star}<span class="burst__food">${HIT_FOOD.sushi}</span>`);
    pizzaHit = make('burst', `${star}<span class="burst__food">${HIT_FOOD.pizza}</span>`);
    bits = BITS.map((b, i) => make(i % 3 === 0 ? 'bit bit--accent' : 'bit', b));
    rings = [0, 1, 2].map(() => make('ring'));
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

  function burst(el) {
    return gsap.timeline()
      .fromTo(el, { autoAlpha: 1, scale: 0, rotation: -40 },
        { scale: 1, rotation: 0, duration: 0.18, ease: 'back.out(3)', immediateRender: false })
      .to(el, { autoAlpha: 0, scale: 1.25, duration: 0.2, ease: 'power1.in' }, '+=0.28');
  }

  // wind-up, strike (impact lands at +0.3s), then return to rest
  function strike(ch, rest, hit, dir, windup) {
    return gsap.timeline()
      .to(ch.root, { x: rest - dir * windup, duration: 0.18, ease: 'power2.out' }, 0)
      .to(ch.body, { rotation: -dir * 14, duration: 0.18, ease: 'power2.out' }, 0)
      .to(ch.root, { x: hit, duration: 0.12, ease: 'power4.in' }, 0.18)
      .to(ch.body, { rotation: dir * 24, duration: 0.12, ease: 'power4.in' }, 0.18)
      .to(ch.root, { x: rest, duration: 0.35, ease: 'power2.inOut' }, 0.5)
      .to(ch.body, { rotation: 0, duration: 0.35, ease: 'power2.inOut' }, 0.5);
  }

  // fighter pops its head out of the top of the brawl cloud
  function peek(ch, dir, y) {
    return gsap.timeline()
      .to(ch.lift, { y, duration: 0.16, ease: 'power2.out' }, 0)
      .to(ch.body, { rotation: dir * 22, duration: 0.16, ease: 'power2.out' }, 0)
      .to(ch.lift, { y: 0, duration: 0.2, ease: 'power2.in' }, 0.26)
      .to(ch.body, { rotation: 0, duration: 0.2, ease: 'power2.in' }, 0.26);
  }

  // background icons get knocked sideways, then wobble back
  function jolt(els, dir, power = 1) {
    return gsap.timeline()
      .to(els, { x: dir * 16 * power, rotation: dir * 14 * power, duration: 0.12 * power, ease: 'power2.out', stagger: 0.015 }, 0)
      .to(els, { x: 0, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', stagger: 0.015 }, 0.14 * power);
  }

  function cloudWobble(dur, cw) {
    const t = gsap.timeline();
    const step = 0.13;
    for (let at = 0; at < dur - step; at += step) {
      t.to(wobble, {
        x: gsap.utils.random(-1, 1) * cw * 0.04,
        y: gsap.utils.random(-1, 1) * cw * 0.03,
        rotation: gsap.utils.random(-5, 5),
        duration: step,
        ease: 'sine.inOut',
      }, at);
    }
    t.to(wobble, { x: 0, y: 0, rotation: 0, duration: 0.1 });

    const half = 0.17;
    const repeat = Math.max(1, 2 * Math.floor(dur / (2 * half)) - 1); // odd, so puffs end at scale 1
    puffPairs.forEach((pp, i) => {
      t.to(pp, { scale: gsap.utils.random(1.08, 1.2), duration: half, ease: 'sine.inOut', yoyo: true, repeat }, (i % 4) * 0.05);
    });
    return t;
  }

  function cloudBits(dur, x0, y0, reach) {
    const t = gsap.timeline();
    const gap = dur / bits.length;
    bits.forEach((bit, i) => {
      const a = gsap.utils.random(-165, -15) * Math.PI / 180;
      const d = reach * gsap.utils.random(0.75, 1.15);
      t.fromTo(bit, { x: x0, y: y0, scale: 0.3, rotation: 0, autoAlpha: 1 }, {
        x: x0 + Math.cos(a) * d,
        y: y0 + Math.sin(a) * d,
        scale: gsap.utils.random(0.9, 1.35),
        rotation: gsap.utils.random(-50, 50),
        duration: 0.55,
        ease: 'power2.out',
        immediateRender: false,
      }, i * gap)
        .to(bit, { autoAlpha: 0, duration: 0.18 }, i * gap + 0.4);
    });
    return t;
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

  function build() {
    if (tl) tl.kill();
    removeProps();

    const korean = icons.aiko;
    const italian = icons.capiche;
    const indian = icons.beshak;

    // measure the CSS resting layout with no transforms applied
    gsap.set([scene, wobble, mandala, title, sub, replayBtn, ...korean, ...italian, ...indian,
      ...[A, C, T].flatMap((c) => [c.root, c.lift, c.body, c.shadow, c.rider]).filter(Boolean), ...RIG],
    { clearProps: 'transform,opacity,visibility,zIndex' });
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

    // fighters: x targets are absolute stage px, converted to offsets from each resting spot
    const ax = (px) => px - m.a.x;
    const cxo = (px) => px - m.c.x;
    const space = Math.max(W * 0.035, 14);
    const knock = Math.max(W * 0.05, 24);
    const windup = Math.max(W * 0.015, 8);

    const aOff = ax(-m.a.w);
    const cOff = cxo(W + m.c.w);
    const aFace = ax(cx - space - m.a.w / 2);
    const cFace = cxo(cx + space + m.c.w / 2);
    const aHit = ax(cx + space - m.a.w * 0.38);
    const cHit = cxo(cx - space + m.c.w * 0.38);
    const aMid = ax(cx - m.a.w * 0.2);
    const cMid = cxo(cx + m.c.w * 0.2);

    const cw = Math.max(m.a.w + m.c.w, fh * 1.25) * 1.12;
    const ch = cw * 0.8;
    const cloudY = floorY - ch * 0.45;
    const cloudTop = cloudY - ch / 2;
    const peekA = cloudTop - m.a.h * 0.5 - m.a.top;
    const peekC = cloudTop - m.c.h * 0.5 - m.c.top;

    // the tiger's path, as centre x in stage px: lands top-left-ish, walks 3 steps into the brawl
    const landCx = Math.max(tw / 2 + 16, cx - cw / 2 - tw * 0.66);
    const walkCx = Math.max(cx, landCx + 36);
    const exitCx = W + tw * 0.75 + 40;
    const tx = (px) => px - cx; // tiger offsets are from the stage centre

    // Caiko sits on the saddle: data-saddle (on the tiger) meets data-seat (on Caiko)
    const [saddleX, saddleY] = pair(T.img.dataset.saddle, '0.45 0.15');
    const [seatX, seatY] = pair(T.rider.dataset.seat, '0.5 0.8');
    const rw = T.rider.offsetWidth;
    const rh = T.rider.offsetHeight;
    const riderLeft = saddleX * tw - seatX * rw;
    const riderTop = saddleY * th - seatY * rh;
    Object.assign(T.rider.style, { left: `${riderLeft}px`, top: `${riderTop}px` });

    // the roar comes out of the tiger's mouth, where it stops after its walk
    const [roarFx, roarFy] = pair(T.img.dataset.roar, '0.5 0.42');
    const rs = th * 0.8;
    const ringMax = Math.hypot(W, H) * 1.1;

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

    // starting state
    gsap.set(A.root, { x: aOff });
    gsap.set(C.root, { x: cOff });
    gsap.set(T.root, { x: tx(-tw * 0.6) });
    const ledge = -(floorY - th); // lift that puts the tiger up in the top-left corner
    gsap.set(T.lift, { y: ledge, autoAlpha: 0 });
    gsap.set(T.shadow, { scale: 0.2, opacity: 0 });
    gsap.set(cloud, { x: cx, y: cloudY, width: cw, height: ch, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0, zIndex: 3 });
    gsap.set(puffPairs.flat(), { scale: 1 });
    gsap.set(puffPairs.flat(), { clearProps: 'backgroundColor' }); // an opening may tint the cloud
    gsap.set([bolt, sushiHit, pizzaHit, ...bits, ...rings, ...dust, ...hearts], { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 1, rotation: 0 });
    gsap.set(bolt, { x: cx, y: floorY - fh * 0.6, scale: 0 });
    gsap.set(sushiHit, { x: cx + space, y: m.c.top + m.c.h * 0.38 });
    gsap.set(pizzaHit, { x: cx - space, y: m.a.top + m.a.h * 0.4 });
    gsap.set(rings, { width: rs, height: rs });
    gsap.set([...korean, ...italian, ...indian], { scale: 0, autoAlpha: 0 });
    gsap.set(mandala, { left: cx, top: m.title.cy, width: ms, height: ms, xPercent: -50, yPercent: -50, scale: 0.3, autoAlpha: 0 });
    gsap.set(T.rider, { transformOrigin: '50% 100%' });
    gsap.set([title, sub, replayBtn], { autoAlpha: 0, y: 18 });
    gsap.set(skipBtn, { autoAlpha: 1 });

    tl = gsap.timeline({ paused: true, onComplete: () => document.dispatchEvent(new Event('intro:done')) });

    /* --- the tiger act, as building blocks the openings can use -------------- */

    const STEP = 0.4;
    const EXIT_STEP = 0.34;
    const poofScale = Math.max((tw * 1.3) / cw, 1.6);
    const mouthAt = (tcx) => ({ x: tcx - tw / 2 + tw * roarFx, y: m.t.top + th * roarFy });
    const saddleAt = (tcx) => ({ x: tcx - tw / 2 + riderLeft + rw * seatX, y: m.t.top + riderTop + rh * seatY });

    // the tiger is already on stage, standing with its centre at `tcx`
    function tigerOn(tcx) {
      gsap.set(T.root, { x: tx(tcx) });
      gsap.set(T.lift, { y: 0, autoAlpha: 1 });
      gsap.set(T.shadow, { scale: 1, opacity: 1 });
    }

    // eyes shut / open (both, 'left' or 'right')
    function eyes(at, state, which = 'both') {
      const els = which === 'left' ? [lidL] : which === 'right' ? [lidR] : [lidL, lidR];
      tl.set(els, { autoAlpha: state === 'shut' ? 1 : 0 }, at);
    }

    // a quick bite: jaw down and up
    function chomp(at, times = 1) {
      for (let i = 0; i < times; i++) {
        const t0 = at + i * 0.22;
        tl.to(jaw, { y: th * 0.045, duration: 0.08, ease: 'power2.out' }, t0)
          .to(tongue, { y: th * 0.022, duration: 0.08, ease: 'power2.out' }, t0)
          .to([jaw, tongue], { y: 0, duration: 0.1, ease: 'power2.in' }, t0 + 0.1);
      }
      return at + times * 0.22;
    }

    // the cloud churns with the two inside: things fly out, heads pop up
    function brawl(from, to, peeks = []) {
      tl.add(cloudWobble(to - from - 0.1, cw), from + 0.1)
        .add(cloudBits(to - from - 0.4, cx, cloudY - ch * 0.1, cw * 0.62), from + 0.1)
        .add(peek(A, -1, peekA), from + 0.3)
        .add(peek(C, 1, peekC), from + 0.8);
      peeks.forEach((at, i) => tl.add(i % 2 ? peek(C, 1, peekC) : peek(A, -1, peekA), at));
    }

    // trots into the top-left corner, crouches, and springs down in an arc to `landX`; returns landing time
    function leap(at, landX) {
      const JUMP = at + 0.6;
      const LEAP = 0.8;
      const LAND = JUMP + LEAP;
      tl.set(T.lift, { autoAlpha: 1 }, at)
        .to(T.root, { x: tx(-tw * 0.05), duration: JUMP - at - 0.1, ease: 'power2.out' }, at)
        .add(gait(2, 0.17), at)
        .add(squash(T, 0.12, 0.3), JUMP - 0.12)
        .to(T.root, { x: tx(landX), duration: LEAP, ease: 'none' }, JUMP)
        .to(T.lift, {
          keyframes: [
            { y: ledge - th * 0.3, duration: LEAP * 0.3, ease: 'power2.out' },
            { y: 0, duration: LEAP * 0.7, ease: 'power2.in' },
          ],
        }, JUMP)
        .to(T.body, {
          keyframes: [
            { rotation: -8, duration: LEAP * 0.25, ease: 'power1.out' },
            { rotation: 16, duration: LEAP * 0.75, ease: 'power1.in' },
          ],
        }, JUMP)
        .to(T.shadow, { scale: 1, opacity: 1, duration: LEAP, ease: 'power2.in' }, JUMP)
        .to([foreFar, foreNear], { skewX: 24, duration: LEAP * 0.6, ease: 'power2.out' }, JUMP)
        .to([hindNear, hindFar], { skewX: -24, duration: LEAP * 0.6, ease: 'power2.out' }, JUMP)
        .to(tail, { rotation: 22, duration: LEAP * 0.5, ease: 'power2.out' }, JUMP)
        .to(LEGS, { skewX: 0, duration: 0.25, ease: 'back.out(2)' }, LAND)
        .to(head, { keyframes: [{ rotation: -6, duration: LEAP * 0.3, ease: 'power2.out' }, { rotation: 5, duration: LEAP * 0.7, ease: 'power1.in' }] }, JUMP)
        .to(head, { rotation: 0, duration: 0.3, ease: 'back.out(2)' }, LAND)
        .to(tail, { rotation: 0, duration: 0.25, ease: 'power2.out' }, LAND)
        .to(T.body, { rotation: 0, duration: 0.3, ease: 'back.out(3)' }, LAND)
        .add(squash(T, 0.2), LAND)
        .add(shake(16, 0.4), LAND)
        .add(dustPuff(landX, floorY, tw * 0.6), LAND);
      return LAND;
    }

    // one shake of the head, like a cat shaking off a jump; ear flapping
    function headShake(at) {
      const sx = th * 0.045;
      tl.to(head, {
        keyframes: [
          { x: -sx, rotation: -5, duration: 0.07, ease: 'sine.out' },
          { x: sx, rotation: 5, duration: 0.09, ease: 'sine.inOut' },
          { x: -sx * 0.8, rotation: -4, duration: 0.09, ease: 'sine.inOut' },
          { x: sx * 0.55, rotation: 2.6, duration: 0.09, ease: 'sine.inOut' },
          { x: -sx * 0.25, rotation: -1.2, duration: 0.08, ease: 'sine.inOut' },
          { x: 0, rotation: 0, duration: 0.12, ease: 'sine.out' },
        ],
      }, at)
        .to(ear, { keyframes: { rotation: [10, -6, 8, -3, 0] }, duration: 0.5, ease: 'none' }, at);
      return at + 0.55;
    }

    // India's mandala opens behind the title and its icons fly out from `from` (a stage point)
    function bloomAt(at, from) {
      tl.fromTo(mandala, { scale: 0.3, rotation: -90, autoAlpha: 0 },
        { scale: 1, rotation: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out', immediateRender: false }, at)
        .fromTo(indian, { x: (i) => from.x - indianPos[i].x, y: (i) => from.y - indianPos[i].y, scale: 0, autoAlpha: 0 },
          { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: { each: 0.06, from: 'center' }, immediateRender: false }, at + 0.1);
    }

    // the roar: head up, jaw wide, shockwave from its mouth; the countries react.
    // With `bloom`, India's mandala and icons burst out too. Returns when it's over.
    function roarAt(at, tcx, { bloom = true, base = 1 } = {}) {
      const mo = mouthAt(tcx);
      tl.set(rings, { x: mo.x, y: mo.y }, at)
        .to(T.body, {
          keyframes: [
            { scale: base * 1.12, duration: 0.14, ease: 'power2.out' },
            { scale: base, duration: 0.55, ease: 'elastic.out(1, 0.4)' },
          ],
        }, at)
        .fromTo(rings, { width: rs * 0.3, height: rs * 0.3, autoAlpha: 1 },
          { width: ringMax, height: ringMax, autoAlpha: 0, duration: 1, ease: 'power2.out', stagger: 0.15, immediateRender: false }, at)
        .add(shake(9, 0.5), at + 0.02)
        .to(tail, { keyframes: [{ rotation: 28, duration: 0.15, ease: 'power2.out' }, { rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }] }, at + 0.2)
        .to(head, {
          keyframes: [
            { rotation: 4, duration: 0.12, ease: 'power2.out' },
            { rotation: -8, duration: 0.14, ease: 'power3.out' },
            { rotation: -8, duration: 0.45 },
            { rotation: 0, duration: 0.4, ease: 'power2.inOut' },
          ],
        }, at - 0.1)
        .to(jaw, { x: 0, y: th * 0.06, rotation: 0, duration: 0.14, ease: 'back.out(2)' }, at + 0.02)
        .to(tongue, { y: th * 0.03, duration: 0.14, ease: 'back.out(2)' }, at + 0.02)
        .to(jaw, { y: 0, duration: 0.25, ease: 'power2.in' }, at + 0.62)
        .to(tongue, { y: 0, duration: 0.25, ease: 'power2.in' }, at + 0.62)
        .to(ear, { rotation: 7, duration: 0.1, ease: 'power2.out' }, at + 0.02)
        .to(ear, { rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, at + 0.7)
        .to(T.rider, {
          keyframes: [
            { y: -rh * 0.14, rotation: -10, duration: 0.15, ease: 'power2.out' },
            { y: 0, rotation: 0, duration: 0.45, ease: 'bounce.out' },
          ],
        }, at + 0.05)
        .add(jolt(korean, -1, 2.2), at)
        .add(jolt(italian, 1, 2.2), at);
      if (bloom) bloomAt(at, mo);
      return at + 1.15;
    }

    // the cloud clears: Aiko and Capiche are now Caiko, riding the tiger at `tcx`; returns when settled
    function reveal(at, tcx) {
      const s = saddleAt(tcx);
      tl.to(cloud, { scale: poofScale * 1.35, autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, at)
        .add(dustPuff(tcx, floorY, tw * 0.7), at)
        .fromTo(T.rider, { scale: 0.5, y: -th * 0.3 }, { scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)', immediateRender: false }, at)
        .add(heartsUp(s.x, m.t.top + riderTop, rh * 0.8), at + 0.3)
        .to(head, { keyframes: [{ rotation: -5, duration: 0.3, ease: 'power2.out' }, { rotation: 0, duration: 0.3, ease: 'power2.inOut', delay: 0.1 }] }, at + 0.1)
        .to(ear, { rotation: 8, duration: 0.07, yoyo: true, repeat: 3 }, at + 0.5)
        .to(T.rider, { y: -rh * 0.15, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1 }, at + 0.6);
      return at + 1.0;
    }

    // both jump onto the tiger's back, a poof, and out comes Caiko riding; returns when settled
    function mount(at, tcx) {
      const s = saddleAt(tcx);
      tl.add(hop(A, ax(s.x - m.a.w * 0.15), 0.45, fh * 0.8), at)
        .add(hop(C, cxo(s.x + m.c.w * 0.15), 0.45, fh * 0.8), at + 0.06)
        .set(cloud, { x: tcx, y: floorY - th * 0.5, zIndex: 5 }, at + 0.25)
        .fromTo(cloud, { scale: 0.2, autoAlpha: 1 }, { scale: poofScale, duration: 0.3, ease: 'back.out(1.8)', immediateRender: false }, at + 0.25)
        .add(cloudWobble(0.6, cw), at + 0.4)
        .add(shake(12, 0.35), at + 0.4)
        .set([A.root, C.root], { autoAlpha: 0 }, at + 0.5)
        .set(T.rider, { autoAlpha: 1 }, at + 0.5);
      return reveal(at + 1.0, tcx);
    }

    function titleIn(at) {
      tl.to(skipBtn, { autoAlpha: 0, duration: 0.3 }, at - 0.3)
        .to(title, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, at)
        .to(sub, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at + 0.25)
        .to(replayBtn, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, at + 0.6);
      return at + 1.2;
    }

    // walks off to the right (rider bobbing along); the title rises as it leaves
    function exitRight(at, fromCx) {
      const steps = gsap.utils.clamp(5, 9, Math.ceil((exitCx - fromCx) / (tw * 0.3)));
      const end = at + steps * EXIT_STEP;
      tl.add(walk(T, tx(exitCx), steps, EXIT_STEP, th * 0.035), at)
        .add(gait(steps, EXIT_STEP), at)
        .to(T.rider, { y: -rh * 0.05, duration: EXIT_STEP / 2, ease: 'sine.inOut', yoyo: true, repeat: steps * 2 - 1 }, at + 0.15)
        .set(T.root, { autoAlpha: 0 }, end);
      titleIn(at + (end - at) * 0.55);
      return end;
    }

    // the original tiger act: leap in, shake, walk into the cloud, Caiko rides out, roar, exit
    function standardAct(clash) {
      const RUNIN = clash + 0.23;
      const LAND = leap(RUNIN, landCx);
      const WALK = LAND + 0.95;
      const INSIDE = WALK + 3 * STEP;   // the tiger is fully inside the cloud
      const VANISH = INSIDE + 0.55;     // the cloud clears: Caiko is riding
      tl.set(cloud, { zIndex: 5 }, RUNIN + 0.6);
      brawl(clash, VANISH, [LAND + 0.15, WALK + 0.3]);
      headShake(LAND + 0.32);
      tl.add(walk(T, tx(walkCx), 3, STEP, th * 0.035), WALK)
        .add(gait(3, STEP), WALK)
        .to(cloud, { y: floorY - th * 0.5, scale: poofScale, duration: INSIDE - WALK - STEP * 1.2, ease: 'power1.in' }, WALK + STEP * 1.2)
        .add(shake(14, 0.4), INSIDE)
        .set([A.root, C.root], { autoAlpha: 0 }, INSIDE + 0.25)
        .set(T.rider, { autoAlpha: 1 }, INSIDE + 0.25);
      const ROAR = reveal(VANISH, walkCx);
      const EXIT = roarAt(ROAR, walkCx);
      exitRight(EXIT, walkCx);
    }

    /* --- the opening act (openings.js) --------------------------------------- */

    const opening = OPENINGS[variant]({
      tl, gsap, A, C, T, m, W, H, cx, floorY, fh, tw, th, space, knock, windup, ax, cxo, tx,
      aOff, cOff, aFace, cFace, aHit, cHit, aMid, cMid, landCx, walkCx, exitCx, ledge, STEP,
      cloud, cw, ch, cloudY, poofScale, bolt, sushiHit, pizzaHit, korean, italian, indian, hearts, mandala,
      head, jaw, tongue, ear, tail, LEGS, rider: T.rider, rw, rh,
      FOOD: HIT_FOOD, prop, held, bg, fx,
      hop, hopInPlace, squash, shake, burst, strike, jolt, heartsUp, dustPuff, walk, gait, peek, peekA, peekC,
      tigerOn, eyes, chomp, brawl, leap, headShake, roarAt, bloomAt, reveal, mount, titleIn, exitRight, mouthAt, saddleAt,
      cloudFill: puffPairs.map((pp) => pp[1]),
    });
    (opening.bits || BITS).forEach((b, i) => {
      if (!bits[i]) return;
      const icon = b.trim().startsWith('<');
      bits[i].className = icon ? 'bit bit--icon' : (i % 3 === 0 ? 'bit bit--accent' : 'bit');
      bits[i].innerHTML = b;
    });

    // the countries pop in as the two arrive (unless the opening brings them in itself)
    if (!opening.ownCountries) {
      tl.to(korean, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.05 }, 0.05)
        .to(italian, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.05 }, 0.17);
    }

    // openings that end in the cloud get the original tiger act; the others stage their own
    if (!opening.own) standardAct(opening.clash);

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
    tl.progress(1);
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

    // variation switcher: rebuild with another opening act and play it from the top
    const switcher = document.querySelectorAll('[data-variant]');
    const mark = () => switcher.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.variant === variant)));
    mark();
    switcher.forEach((btn) => btn.addEventListener('click', () => {
      variant = btn.dataset.variant;
      const url = new URL(location.href);
      url.searchParams.set('v', variant);
      url.searchParams.delete('t');
      history.replaceState(null, '', url);
      mark();
      build();
      document.dispatchEvent(new Event('intro:start'));
      tl.play(0);
    }));

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
        if (done) tl.progress(1);
        else if (paused) tl.pause(time);
        else tl.play(time);
      }, 120);
    });
  }

  init();
})();

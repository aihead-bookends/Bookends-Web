/* ==========================================================================
   Opening acts for the intro: everything before the tiger arrives.
   Each one brings Aiko and Capiche in, tells its little story, and ends with
   both of them at the centre inside the cloud. It returns when the cloud
   forms (clash) and what flies out of it (bits). The tiger act that follows
   is the same for every opening (see intro.js).

   Every function gets one `c` object from intro.js: the timeline, the
   characters, the measured layout and the motion helpers.
   ========================================================================== */
window.BOOKENDS_OPENINGS = (() => {
  'use strict';

  const ART = {
    dough: `<svg viewBox="0 0 64 40"><ellipse cx="32" cy="20" rx="30" ry="12" fill="#F3E3C3" stroke="#111" stroke-width="2.6"/>
      <ellipse cx="32" cy="19" rx="23" ry="8" fill="#F8EDD6" stroke="#D9B98A" stroke-width="1.6"/></svg>`,
    pie: `<svg viewBox="0 0 64 40"><ellipse cx="32" cy="20" rx="30" ry="12" fill="#D9963B" stroke="#111" stroke-width="2.6"/>
      <ellipse cx="32" cy="19" rx="24" ry="8.6" fill="#F6C453"/>
      <circle cx="21" cy="18" r="3" fill="#C8553D"/><circle cx="35" cy="14.5" r="3" fill="#C8553D"/>
      <circle cx="43" cy="21" r="3" fill="#C8553D"/><circle cx="29" cy="23.5" r="2.6" fill="#C8553D"/>
      <path d="M29 14l1 1M47 17l1 1M16 22l1 1" stroke="#3E7D44" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    table: `<svg viewBox="0 0 120 72" stroke="#111" stroke-linecap="round" stroke-linejoin="round">
      <path d="M28 34v34M92 34v34" stroke-width="4.5"/>
      <path d="M12 18h96l-6 16H18z" fill="#C8553D" stroke-width="3"/>
      <path d="M34 18l-3 16M52 18l-1 16M68 18l1 16M86 18l3 16" stroke="#FBF6EC" stroke-width="3"/>
      <path d="M6 18h108" stroke-width="4.5"/></svg>`,
    plate: `<svg viewBox="0 0 64 14"><ellipse cx="32" cy="7" rx="29" ry="5" fill="#FBF6EC" stroke="#111" stroke-width="2.6"/></svg>`,
    noodle: `<svg viewBox="0 0 200 20" preserveAspectRatio="none" fill="none">
      <path d="M0 10C12 2 24 18 36 10S60 2 72 10s24 8 36 0 24-8 36 0 24 8 36 0 16-4 20 0" stroke="#111" stroke-width="8" vector-effect="non-scaling-stroke" stroke-linecap="round"/>
      <path d="M0 10C12 2 24 18 36 10S60 2 72 10s24 8 36 0 24-8 36 0 24 8 36 0 16-4 20 0" stroke="#F2CF7A" stroke-width="4" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>`,
    curl: `<svg viewBox="0 0 40 40" fill="none" stroke-linecap="round"><path d="M6 30c6-20 22-20 22-8s-14 10-12-2 18-12 20 4" stroke="#111" stroke-width="5"/>
      <path d="M6 30c6-20 22-20 22-8s-14 10-12-2 18-12 20 4" stroke="#F2CF7A" stroke-width="2.6"/></svg>`,
    note: `<svg viewBox="0 0 40 64" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"><path d="M26 46V8c4 8 12 10 10 22"/>
      <ellipse cx="18" cy="47" rx="9" ry="7" fill="#111" stroke="none" transform="rotate(-18 18 47)"/></svg>`,
    notes: `<svg viewBox="0 0 64 64" fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round"><path d="M24 48V14l30-6v32"/>
      <ellipse cx="17" cy="48" rx="8" ry="6" fill="#C8553D" stroke="#111" stroke-width="2.4" transform="rotate(-18 17 48)"/>
      <ellipse cx="47" cy="41" rx="8" ry="6" fill="#C8553D" stroke="#111" stroke-width="2.4" transform="rotate(-18 47 41)"/></svg>`,
  };

  /* --- shared building blocks ---------------------------------------------- */

  // stage x of a character's centre for a given root offset
  const aX = (c, off) => c.m.a.x + off;
  const cX = (c, off) => c.m.c.x + off;
  // where they hold things: Aiko's right hand (arm end), Capiche's left lobe
  const aHand = (c, off) => ({ x: aX(c, off) + c.m.a.w * 0.46, y: c.m.a.top + c.m.a.h * 0.64 });
  const cHand = (c, off) => ({ x: cX(c, off) - c.m.c.w * 0.44, y: c.m.c.top + c.m.c.h * 0.55 });

  // both hop in from the edges to the given spots (offsets); done by ~1.2s
  function enter(c, aTo = c.aFace, cTo = c.cFace) {
    const { tl, A, C, fh } = c;
    tl.add(c.hop(A, (c.aOff + aTo) / 2, 0.5, fh * 0.45), 0)
      .add(c.squash(A, 0.18, 0.4), 0.5)
      .add(c.hop(A, aTo, 0.42, fh * 0.25), 0.55)
      .add(c.squash(A, 0.14), 0.97)
      .add(c.hop(C, (c.cOff + cTo) / 2, 0.5, fh * 0.45), 0.12)
      .add(c.squash(C, 0.18, 0.4), 0.62)
      .add(c.hop(C, cTo, 0.42, fh * 0.25), 0.67)
      .add(c.squash(C, 0.14), 1.09);
    return 1.2;
  }

  // both rush to the centre and the cloud forms around them
  function charge(c, at, spin = 0) {
    const { tl, A, C } = c;
    const clash = at + 0.37;
    tl.to(A.body, { rotation: -10, duration: 0.15 }, at)
      .to(C.body, { rotation: 10, duration: 0.15 }, at)
      .to(A.root, { x: c.aMid, duration: 0.22, ease: 'power3.in' }, at + 0.15)
      .to(C.root, { x: c.cMid, duration: 0.22, ease: 'power3.in' }, at + 0.15)
      .to([A.body, C.body], { rotation: (i) => (i ? -spin : spin), duration: 0.22 }, at + 0.15)
      .set([A.body, C.body], { rotation: 0 }, at + 0.38)
      .to(c.cloud, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(2)' }, clash - 0.04)
      .add(c.shake(10, 0.28), clash);
    return clash;
  }

  // a word or two popping up over the stage
  function say(c, text, at, x, y, hold = 0.55) {
    const el = c.prop('say', text);
    c.tl.fromTo(el, { x, y, autoAlpha: 1, scale: 0, rotation: -12 },
      { scale: 1, rotation: 0, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, at)
      .to(el, { autoAlpha: 0, scale: 1.25, duration: 0.22, ease: 'power2.in' }, at + 0.3 + hold);
    return el;
  }

  // something tossed from one point to another in an arc
  function arc(c, el, from, to, at, dur, height, spin = 0) {
    c.tl.fromTo(el, { x: from.x }, { x: to.x, duration: dur, ease: 'none', immediateRender: false }, at)
      .fromTo(el, { y: from.y }, {
        keyframes: [
          { y: Math.min(from.y, to.y) - height, duration: dur / 2, ease: 'power2.out' },
          { y: to.y, duration: dur / 2, ease: 'power2.in' },
        ],
        immediateRender: false,
      }, at);
    if (spin) c.tl.fromTo(el, { rotation: 0 }, { rotation: spin, duration: dur, ease: 'none', immediateRender: false }, at);
  }

  const pop = (c, el, at, x, y, rotation = 0) =>
    c.tl.fromTo(el, { x, y, rotation, autoAlpha: 1, scale: 0 },
      { scale: 1, duration: 0.25, ease: 'back.out(2.5)', immediateRender: false }, at);

  const gone = (c, els, at) => c.tl.to(els, { autoAlpha: 0, scale: 0.4, duration: 0.2, ease: 'power2.in' }, at);

  /* --- 0 · fight (the original) --------------------------------------------- */

  function fight(c) {
    const { tl, A, C, fh, floorY, bolt } = c;
    enter(c);
    const FACEOFF = 1.25;
    const HIT1 = 2.15;
    const HIT2 = 3.25;

    tl.to([A.lift, C.lift], { y: -fh * 0.04, duration: 0.16, ease: 'sine.inOut', yoyo: true, repeat: 5, stagger: 0.08 }, FACEOFF)
      .to(A.body, { rotation: -7, duration: 0.3 }, FACEOFF)
      .to(C.body, { keyframes: { rotation: [8, -8, 8, -6, 0] }, duration: 0.7, ease: 'none' }, FACEOFF + 0.15)
      .fromTo(bolt, { autoAlpha: 1, scale: 0, rotation: -25, y: floorY - fh * 0.6 - fh * 0.4 },
        { scale: 1, rotation: 0, y: floorY - fh * 0.6, duration: 0.18, ease: 'back.out(2.5)', immediateRender: false }, FACEOFF + 0.2)
      .to(bolt.firstElementChild, { keyframes: { opacity: [0.25, 1, 0.4, 1] }, duration: 0.3, ease: 'none' }, FACEOFF + 0.38)
      .add(c.shake(7, 0.22), FACEOFF + 0.25)
      .to(bolt, { autoAlpha: 0, scale: 1.35, duration: 0.25, ease: 'power2.in' }, FACEOFF + 0.85);

    // Aiko strikes, Capiche spins away
    const IMPACT1 = HIT1 + 0.3;
    tl.add(c.strike(A, c.aFace, c.aHit, 1, c.windup), HIT1)
      .add(c.burst(c.sushiHit), IMPACT1)
      .add(c.shake(12, 0.3), IMPACT1)
      .add(c.jolt(c.italian, 1), IMPACT1)
      .to(C.root, { x: c.cFace + c.knock, duration: 0.45, ease: 'power3.out' }, IMPACT1)
      .to(C.body, { rotation: 360, duration: 0.5, ease: 'power2.out' }, IMPACT1)
      .set(C.body, { rotation: 0 }, IMPACT1 + 0.5)
      .add(c.hopInPlace(C, c.m.c.h * 0.22, 0.42), IMPACT1)
      .add(c.squash(C, 0.15), IMPACT1 + 0.42)
      .to(C.root, { x: c.cFace, duration: 0.3, ease: 'power2.inOut' }, IMPACT1 + 0.48);

    // Capiche slaps back, Aiko gets squashed
    const IMPACT2 = HIT2 + 0.3;
    tl.add(c.strike(C, c.cFace, c.cHit, -1, c.windup), HIT2)
      .add(c.burst(c.pizzaHit), IMPACT2)
      .add(c.shake(14, 0.32), IMPACT2)
      .add(c.jolt(c.korean, -1), IMPACT2)
      .to(A.root, { x: c.aFace - c.knock, duration: 0.4, ease: 'power3.out' }, IMPACT2)
      .to(A.body, {
        keyframes: [
          { scaleX: 0.68, scaleY: 1.16, rotation: -16, duration: 0.09, ease: 'power2.out' },
          { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.65, ease: 'elastic.out(1, 0.35)' },
        ],
      }, IMPACT2)
      .to(A.root, { x: c.aFace, duration: 0.3, ease: 'power2.inOut' }, IMPACT2 + 0.55);

    return { clash: charge(c, 4.3) };
  }

  /* --- 1 · cook-off: Aiko flips sushi, Capiche spins pizza dough ------------ */

  function cookoff(c) {
    const { tl, A, C, fh, cx, W, FOOD } = c;
    const aSt = c.ax(cx - W * 0.17);
    const cSt = c.cxo(cx + W * 0.17);
    enter(c, aSt, cSt);
    say(c, 'Ready… cook!', 1.25, cx, c.m.a.top - fh * 0.05, 0.5);
    tl.add(c.shake(5, 0.2), 1.35);

    const size = fh * 0.34;
    const hand = aHand(c, aSt);
    const s1 = c.prop('dish', FOOD.sushi, size);
    const s2 = c.prop('dish', FOOD.sushi, size);
    const doughAt = { x: cX(c, cSt), y: c.m.c.top - fh * 0.12 };
    const dough = c.prop('dish', ART.dough, fh * 0.62);
    const pie = c.prop('dish', ART.pie, fh * 0.62);

    // Aiko flips a sushi high and catches it
    pop(c, s1, 1.95, hand.x, hand.y);
    arc(c, s1, hand, hand, 2.2, 0.62, fh * 0.9, 360);
    tl.add(c.squash(A, 0.12, 0.4), 2.82);

    // Capiche spins the dough over its head and tosses it
    pop(c, dough, 2.3, doughAt.x, doughAt.y);
    tl.to(dough, { scaleX: 0.82, duration: 0.1, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 2.55);
    arc(c, dough, doughAt, doughAt, 3.15, 0.66, fh * 0.75, 0);
    tl.add(c.squash(C, 0.12, 0.4), 3.81);

    // Aiko shows off with two at once and a spin
    pop(c, s2, 3.35, hand.x, hand.y);
    arc(c, s1, hand, hand, 3.5, 0.75, fh * 1.25, -360);
    arc(c, s2, hand, hand, 3.6, 0.7, fh * 0.95, 360);
    tl.to(A.body, { rotation: 360, duration: 0.5, ease: 'power2.inOut' }, 3.55)
      .set(A.body, { rotation: 0 }, 4.06)
      .add(c.squash(A, 0.14, 0.4), 4.32);

    // Capiche's highest toss comes down as a finished pizza
    arc(c, dough, doughAt, doughAt, 3.95, 0.8, fh * 1.4, 0);
    tl.set(pie, { x: doughAt.x, scale: 1 }, 4.33)
      .to(dough, { autoAlpha: 0, duration: 0.1 }, 4.33)
      .to(pie, { autoAlpha: 1, duration: 0.1 }, 4.33)
      .fromTo(pie, { y: doughAt.y - fh * 1.4 }, { y: doughAt.y, duration: 0.42, ease: 'power2.in', immediateRender: false }, 4.33)
      .add(c.squash(C, 0.14, 0.4), 4.75);

    // proud glare, then both rush in with their dishes: flour everywhere
    tl.to(A.body, { rotation: -8, duration: 0.18 }, 4.85)
      .to(C.body, { rotation: 8, duration: 0.18 }, 4.85);
    const clash = charge(c, 5.15);
    tl.to([s1, s2, pie], { x: cx, y: c.cloudY, duration: 0.3, ease: 'power3.in' }, 5.3);
    gone(c, [s1, s2, pie], clash - 0.05);

    const f = FOOD;
    return { clash, bits: [f.sushi, '✦', f.pizza, '✦', f.sushi, '✶', f.pizza, '✦', f.sushi, '✦', f.pizza, '✶', '✦', f.pizza] };
  }

  /* --- 2 · sharing a table: they swap dishes and make friends --------------- */

  function sharing(c) {
    const { tl, A, C, fh, cx, W, FOOD, floorY } = c;
    const aSt = c.ax(cx - W * 0.17);
    const cSt = c.cxo(cx + W * 0.17);

    // a gentle walk in: three small hops each
    for (let i = 1; i <= 3; i++) {
      tl.add(c.hop(A, c.aOff + ((aSt - c.aOff) * i) / 3, 0.36, fh * 0.12), (i - 1) * 0.36)
        .add(c.hop(C, c.cOff + ((cSt - c.cOff) * i) / 3, 0.36, fh * 0.12), 0.15 + (i - 1) * 0.36);
    }
    tl.add(c.squash(A, 0.1, 0.35), 1.08).add(c.squash(C, 0.1, 0.35), 1.23);

    // shy: both glance away, then back
    tl.to(A.body, { rotation: -10, duration: 0.25, ease: 'sine.inOut' }, 1.5)
      .to(C.body, { rotation: 10, duration: 0.25, ease: 'sine.inOut' }, 1.55)
      .to([A.body, C.body], { rotation: 0, duration: 0.3, ease: 'sine.inOut' }, 2.0);

    const size = fh * 0.34;
    const ha = aHand(c, aSt);
    const hc = cHand(c, cSt);
    const sushi = c.prop('dish', FOOD.sushi, size);
    const pizza = c.prop('dish', FOOD.pizza, size);
    const heartA = c.prop('heart', '♥');
    const heartC = c.prop('heart', '♥');

    // Aiko offers sushi; Capiche is delighted
    pop(c, sushi, 2.35, ha.x, ha.y);
    tl.to(A.body, { rotation: 8, duration: 0.2, yoyo: true, repeat: 1 }, 2.4);
    arc(c, sushi, ha, hc, 2.65, 0.6, fh * 0.5, 0);
    tl.add(c.hopInPlace(C, fh * 0.18, 0.3), 3.3);
    pop(c, heartC, 3.3, cX(c, cSt), c.m.c.top - fh * 0.1);
    tl.to(heartC, { y: `-=${fh * 0.3}`, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 3.6);

    // Capiche offers pizza back; Aiko is delighted
    pop(c, pizza, 3.45, hc.x, hc.y);
    tl.to(C.body, { rotation: -8, duration: 0.2, yoyo: true, repeat: 1 }, 3.5);
    arc(c, pizza, hc, ha, 3.75, 0.6, fh * 0.5, 0);
    tl.add(c.hopInPlace(A, fh * 0.18, 0.3), 4.4);
    pop(c, heartA, 4.4, aX(c, aSt), c.m.a.top - fh * 0.1);
    tl.to(heartA, { y: `-=${fh * 0.3}`, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 4.7);

    // a table rises between them; both dishes land on it, and hearts pop
    const tableW = fh * 0.95;
    const table = c.prop('dish', ART.table, tableW);
    const tableY = floorY - tableW * 0.3;
    const topY = floorY - tableW * 0.52;
    tl.fromTo(table, { x: cx, y: floorY + tableW * 0.3, autoAlpha: 1, scale: 0.6 },
      { y: tableY, scale: 1, duration: 0.45, ease: 'back.out(1.8)', immediateRender: false }, 4.6);
    arc(c, sushi, hc, { x: cx + tableW * 0.18, y: topY }, 4.95, 0.45, fh * 0.3, 0);
    arc(c, pizza, ha, { x: cx - tableW * 0.18, y: topY }, 5.0, 0.45, fh * 0.3, 0);
    tl.add(c.heartsUp(cx, topY - fh * 0.1, fh * 0.8), 5.45);

    // a hug: both hop in behind the table and the cloud swallows them
    tl.add(c.hop(A, c.aMid, 0.4, fh * 0.35), 6.0)
      .add(c.hop(C, c.cMid, 0.4, fh * 0.35), 6.0);
    const clash = 6.38;
    tl.to(c.cloud, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(2)' }, clash - 0.04)
      .add(c.shake(6, 0.22), clash);
    gone(c, [table, sushi, pizza], clash - 0.04);

    const f = FOOD;
    return { clash, bits: ['♥', '✦', f.sushi, '♥', '✶', f.pizza, '♥', '✦', '♥', f.sushi, '✶', '♥', f.pizza, '✦'] };
  }

  /* --- 3 · noodle tug-of-war ------------------------------------------------- */

  function noodle(c) {
    const { tl, A, C, fh, cx, W } = c;
    const aSt = c.ax(cx - W * 0.11);
    const cSt = c.cxo(cx + W * 0.11);
    enter(c, aSt, cSt);

    const d = Math.max(W * 0.03, 12);
    const ha = aHand(c, aSt);
    const hc = cHand(c, cSt);
    const y = (ha.y + hc.y) / 2;
    const L0 = Math.max(hc.x - ha.x, 20);
    const strand = c.prop('noodle', ART.noodle, L0);
    strand.style.height = `${fh * 0.12}px`;
    c.gsap.set(strand, { xPercent: 0, x: ha.x, y, transformOrigin: '0% 50%' });

    // they both grab the same noodle
    tl.fromTo(strand, { autoAlpha: 1, scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, 1.3);
    say(c, 'Mine!', 1.45, cx, c.m.a.top - fh * 0.1, 0.4);

    // tug, tug, tug: [Aiko offset, Capiche offset, Aiko lean, Capiche lean, time]
    const tugs = [
      [-d, -d * 0.5, -14, -10, 1.95],
      [-d * 0.2, d * 1.2, 10, 14, 2.5],
      [-d * 1.4, d * 0.6, -16, -8, 3.05],
      [-d * 1.8, d * 1.6, -18, 18, 3.6],
    ];
    tugs.forEach(([ao, co, ar, cr, at]) => {
      tl.to(A.root, { x: aSt + ao, duration: 0.45, ease: 'power2.inOut' }, at)
        .to(C.root, { x: cSt + co, duration: 0.45, ease: 'power2.inOut' }, at)
        .to(A.body, { rotation: ar, duration: 0.3, ease: 'power2.out' }, at)
        .to(C.body, { rotation: cr, duration: 0.3, ease: 'power2.out' }, at)
        .to(strand, { x: ha.x + ao, width: L0 + (co - ao), duration: 0.45, ease: 'power2.inOut' }, at);
    });
    tl.to(strand, { scaleY: 0.6, duration: 0.3 }, 3.7)
      .to([A.lift, C.lift], { y: -fh * 0.03, duration: 0.05, yoyo: true, repeat: 3 }, 3.85);

    // SNAP: the noodle breaks, both fly back and land on their bottoms
    const SNAP = 4.1;
    const halfA = c.prop('noodle', ART.noodle, (L0 + d * 3.4) / 2);
    const halfC = c.prop('noodle', ART.noodle, (L0 + d * 3.4) / 2);
    [halfA, halfC].forEach((h) => { h.style.height = `${fh * 0.12}px`; });
    c.gsap.set(halfA, { xPercent: 0, x: ha.x - d * 1.8, y, transformOrigin: '0% 50%' });
    c.gsap.set(halfC, { xPercent: -100, x: hc.x + d * 1.6, y, transformOrigin: '100% 50%' });
    tl.set(strand, { autoAlpha: 0 }, SNAP)
      .set([halfA, halfC], { autoAlpha: 1 }, SNAP)
      .to([halfA, halfC], { scaleX: 0, rotation: (i) => (i ? -25 : 25), duration: 0.3, ease: 'power2.in' }, SNAP)
      .set([halfA, halfC], { autoAlpha: 0 }, SNAP + 0.3)
      .add(c.shake(9, 0.25), SNAP);
    say(c, 'SNAP!', SNAP, cx, y - fh * 0.35, 0.35);
    tl.to(A.root, { x: aSt - d * 2.6, duration: 0.3, ease: 'power3.out' }, SNAP)
      .to(C.root, { x: cSt + d * 2.4, duration: 0.3, ease: 'power3.out' }, SNAP)
      .to(A.body, { rotation: -28, duration: 0.2 }, SNAP)
      .to(C.body, { rotation: 28, duration: 0.2 }, SNAP)
      .to([A.body, C.body], { rotation: 0, duration: 0.35, ease: 'back.out(2)' }, SNAP + 0.3)
      .add(c.squash(A, 0.2, 0.4), SNAP + 0.3)
      .add(c.squash(C, 0.2, 0.4), SNAP + 0.3);

    const clash = charge(c, 4.95);
    return { clash, bits: [ART.curl, '!@#$', ART.curl, '✦', '%&!', ART.curl, '★', ART.curl, '!!', '✶', ART.curl, '#@!', ART.curl, '?!'] };
  }

  /* --- 4 · dance-off --------------------------------------------------------- */

  function dance(c) {
    const { tl, A, C, fh, cx, W, korean, italian } = c;
    const aSt = c.ax(cx - W * 0.13);
    const cSt = c.cxo(cx + W * 0.13);
    enter(c, aSt, cSt);

    // the beat drops: a big note, and the countries bounce along
    const big = c.prop('dish', ART.notes, fh * 0.5);
    pop(c, big, 1.25, cx, c.m.a.top + fh * 0.15);
    tl.to(big, { autoAlpha: 0, scale: 1.3, duration: 0.25 }, 1.8)
      .add(c.shake(5, 0.2), 1.3);
    const BEAT = 0.4;
    for (let i = 0; i < 9; i++) {
      tl.to([...korean, ...italian], { y: -7, duration: 0.1, yoyo: true, repeat: 1, ease: 'sine.out' }, 1.3 + i * BEAT);
    }
    // notes float up from between them
    for (let i = 0; i < 8; i++) {
      const n = c.prop('dish', i % 3 ? ART.note : ART.notes, fh * 0.2);
      const at = 1.45 + i * 0.42;
      const sx = cx + (i % 2 ? 1 : -1) * fh * 0.15;
      tl.fromTo(n, { x: sx, y: c.m.a.top + fh * 0.5, autoAlpha: 1, scale: 0.4, rotation: 0 },
        { x: sx + (i % 2 ? 1 : -1) * fh * 0.4, y: c.m.a.top - fh * 0.5, scale: 1, rotation: (i % 2 ? 20 : -20), duration: 1, ease: 'sine.out', immediateRender: false }, at)
        .to(n, { autoAlpha: 0, duration: 0.25 }, at + 0.75);
    }

    // Aiko's solo: jump spin and side steps
    tl.add(c.hopInPlace(A, fh * 0.45, 0.5), 1.65)
      .to(A.body, { rotation: 360, duration: 0.5, ease: 'power1.inOut' }, 1.65)
      .set(A.body, { rotation: 0 }, 2.16)
      .add(c.squash(A, 0.15, 0.3), 2.15)
      .to(A.root, { x: aSt - fh * 0.15, duration: 0.18, ease: 'power2.out' }, 2.25)
      .to(A.root, { x: aSt + fh * 0.1, duration: 0.18, ease: 'power2.inOut' }, 2.45)
      .to(A.root, { x: aSt, duration: 0.15, ease: 'power2.out' }, 2.63);
    tl.to(C.lift, { y: -fh * 0.05, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1.65);

    // Capiche's solo: wiggle and a backflip
    tl.to(C.body, { keyframes: { rotation: [14, -14, 14, -14, 0] }, duration: 0.5, ease: 'none' }, 2.85)
      .add(c.hopInPlace(C, fh * 0.6, 0.55), 3.4)
      .to(C.body, { rotation: -360, duration: 0.55, ease: 'power1.inOut' }, 3.4)
      .set(C.body, { rotation: 0 }, 3.96)
      .add(c.squash(C, 0.18, 0.35), 3.95);
    tl.to(A.lift, { y: -fh * 0.05, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.85);

    // together, in sync
    for (let i = 0; i < 4; i++) {
      const at = 4.3 + i * 0.2;
      tl.add(c.hopInPlace(A, fh * 0.12, 0.2), at).add(c.hopInPlace(C, fh * 0.12, 0.2), at)
        .to([A.body, C.body], { rotation: i % 2 ? -8 : 8, duration: 0.2, ease: 'sine.inOut' }, at);
    }
    tl.to([A.body, C.body], { rotation: 0, duration: 0.1 }, 5.1);

    // and spin into each other
    const clash = charge(c, 5.2, 720);
    return { clash, bits: [ART.note, '✦', ART.notes, '★', ART.note, '✶', ART.notes, '✦', ART.note, '★', ART.notes, '✦', ART.note, '✶'] };
  }

  /* --- 5 · race to serve the table ----------------------------------------- */

  function race(c) {
    const { tl, A, C, fh, cx, FOOD, floorY } = c;
    const tableW = fh * 0.95;
    const table = c.prop('dish', ART.table, tableW);
    tl.fromTo(table, { x: cx, y: floorY + tableW * 0.3, autoAlpha: 1, scale: 0.6 },
      { y: floorY - tableW * 0.3, scale: 1, duration: 0.45, ease: 'back.out(1.8)', immediateRender: false }, 0.1);
    say(c, 'Table for one?', 0.45, cx, floorY - tableW * 1.05, 0.6);

    // each carries a plate above its head
    const tray = (ch, food, w) => c.held(ch, 'tray', `<span class="tray__food">${food}</span>${ART.plate}`, {
      width: w,
      left: (ch === A ? c.m.a.w : c.m.c.w) / 2 - w / 2,
      top: -w * 0.72,
    });
    const tA = tray(A, FOOD.sushi, c.m.a.w * 0.95);
    const tC = tray(C, FOOD.pizza, c.m.c.w * 0.8);

    // the race: quick little hops from both edges
    const aNear = c.ax(cx - tableW / 2 - c.m.a.w * 0.6);
    const cNear = c.cxo(cx + tableW / 2 + c.m.c.w * 0.6);
    for (let i = 1; i <= 7; i++) {
      tl.add(c.hop(A, c.aOff + ((aNear - c.aOff) * i) / 7, 0.24, fh * 0.1), 0.9 + (i - 1) * 0.24)
        .add(c.hop(C, c.cOff + ((cNear - c.cOff) * i) / 7, 0.24, fh * 0.1), 0.95 + (i - 1) * 0.24);
    }
    tl.to([tA, tC], { rotation: (i) => (i ? -7 : 7), duration: 0.12, yoyo: true, repeat: 13, ease: 'sine.inOut' }, 0.9)
      .add(c.squash(A, 0.12, 0.35), 2.6).add(c.squash(C, 0.12, 0.35), 2.65);

    // they arrive at the same moment
    say(c, '!!', 2.75, cx, c.m.a.top - fh * 0.15, 0.35);
    tl.to(A.body, { rotation: -8, duration: 0.18 }, 3.0)
      .to(C.body, { rotation: 8, duration: 0.18 }, 3.0)
      .to([A.body, C.body], { rotation: 0, duration: 0.15 }, 3.3);

    // both lunge for the table: bump, plates fly, cloud
    const clash = charge(c, 3.5);
    tl.to([tA, tC], { y: -fh * 1.1, rotation: (i) => (i ? -220 : 220), duration: 0.5, ease: 'power2.out' }, clash - 0.05)
      .to([tA, tC], { autoAlpha: 0, duration: 0.15 }, clash + 0.3)
      .to(table, { rotation: 14, y: `+=${fh * 0.05}`, duration: 0.2 }, clash - 0.05);
    gone(c, [table], clash + 0.05);

    const f = FOOD;
    return { clash, bits: [f.sushi, '!@#$', f.pizza, '✦', '%&!', f.sushi, '★', f.pizza, '!!', '✶', f.sushi, '#@!', f.pizza, '?!'] };
  }

  return { fight, cookoff, sharing, noodle, dance, race };
})();

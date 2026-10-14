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
    handi: `<svg viewBox="0 0 120 96" stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <path d="M14 34c-8 26 4 54 46 54s54-28 46-54z" fill="#C8553D"/>
      <path d="M20 56c14 6 66 6 80 0" fill="none" stroke="#F6C453" stroke-width="4"/>
      <ellipse cx="60" cy="34" rx="50" ry="9" fill="#E9A23B"/>
      <path d="M2 44h12M106 44h12" stroke-width="5"/></svg>`,
    steam: `<svg viewBox="0 0 20 60" fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round" opacity=".45">
      <path d="M10 58c-8-8 8-14 0-22s8-14 0-22 6-10 0-14"/></svg>`,
    chefHat: `<svg viewBox="0 0 64 64" stroke="#111" stroke-width="3" stroke-linejoin="round">
      <path d="M16 40c-10-2-12-16-2-20 0-10 14-14 20-6 6-8 22-6 22 6 10 2 10 18-2 20z" fill="#FFF"/>
      <rect x="16" y="40" width="32" height="14" rx="2" fill="#FFF"/>
      <path d="M24 44v7M32 44v7M40 44v7" stroke-width="2"/></svg>`,
    bowTie: `<svg viewBox="0 0 64 32" stroke="#111" stroke-width="3" stroke-linejoin="round">
      <path d="M32 16L6 4v24zM32 16l26-12v24z" fill="#C8553D"/>
      <rect x="25" y="9" width="14" height="14" rx="4" fill="#C8553D"/></svg>`,
    doorFrame: `<svg viewBox="0 0 100 170" stroke="#111" stroke-linejoin="round">
      <rect x="6" y="2" width="88" height="22" rx="4" fill="#111"/>
      <text x="50" y="17.5" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="11.5" font-weight="700" letter-spacing="1.2" fill="#FBF6EC" stroke="none">BOOKENDS</text>
      <path d="M12 168V72a38 38 0 0 1 76 0v96z" fill="#F6C453" stroke-width="4"/>
      <path d="M30 168l10-60h20l10 60z" fill="#FBE7A6" stroke="none" opacity=".9"/>
      <path d="M2 168h96" stroke-width="5" stroke-linecap="round"/></svg>`,
    doorLeaf: `<svg viewBox="0 0 100 170" stroke="#111" stroke-linejoin="round">
      <path d="M12 168V72a38 38 0 0 1 76 0v96z" fill="#C8553D" stroke-width="4"/>
      <path d="M24 100V76a26 26 0 0 1 52 0v24zM24 160v-48h52v48z" fill="none" stroke="#8E3A28" stroke-width="3"/>
      <circle cx="78" cy="118" r="4" fill="#F6C453" stroke-width="2.4"/></svg>`,
    card: `<svg viewBox="0 0 48 60"><rect x="3" y="3" width="42" height="54" rx="5" fill="#FBF6EC" stroke="#111" stroke-width="3"/>
      <text x="24" y="41" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="26" fill="#C8553D">10</text></svg>`,
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
  function say(c, text, at, x, y, hold = 0.55, cls = 'say') {
    const el = c.prop(cls, text);
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

  function cookPhase(c) {
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

    // proud glare
    tl.to(A.body, { rotation: -8, duration: 0.18 }, 4.85)
      .to(C.body, { rotation: 8, duration: 0.18 }, 4.85);
    return { s1, s2, pie, aSt, cSt };
  }

  function cookoff(c) {
    const { tl, cx, FOOD } = c;
    const { s1, s2, pie } = cookPhase(c);
    // both rush in with their dishes: flour everywhere
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

  /* --- tiger-led concepts: the tiger has a role from the start --------------- */

  const ESSENCE = window.BOOKENDS_ESSENCE;
  const icon = (name) =>
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${ESSENCE.icons[name]}</svg>`;

  // the tiger's head, ear and nose in stage px, for speech and things it says
  const headTop = (c, tcx) => ({ x: tcx - c.tw / 2 + c.tw * 0.9, y: c.m.t.top + c.th * 0.02 });

  /* --- 6 · the sleeping boss ------------------------------------------------ */

  function sleeping(c) {
    const { tl, gsap, A, C, T, fh, cx, th, head, ear, tail, jaw, tongue } = c;
    c.tigerOn(cx);
    gsap.set(head, { rotation: 7 });           // dozing, chin down
    c.eyes(0, 'shut');

    // breathing, and Zzz drifting up
    tl.to(T.body, { scaleY: 1.035, scaleX: 0.99, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0);
    const ht = headTop(c, cx);
    for (let i = 0; i < 7; i++) {
      const z = c.prop('zzz', i % 2 ? 'z' : 'Z');
      const at = 0.2 + i * 0.6;
      tl.fromTo(z, { x: ht.x, y: ht.y + th * 0.08, autoAlpha: 1, scale: 0.4, rotation: -10 },
        { x: ht.x + fh * 0.25, y: ht.y - fh * 0.35, scale: 1, rotation: 12, duration: 1.1, ease: 'sine.out', immediateRender: false }, at)
        .to(z, { autoAlpha: 0, duration: 0.3 }, at + 0.8);
    }

    // they tiptoe in, standing tall on their toes
    tl.to([A.body, C.body], { scaleY: 1.08, scaleX: 0.94, duration: 0.2 }, 0.1);
    for (let i = 1; i <= 4; i++) {
      tl.add(c.hop(A, c.aOff * (1 - i / 4), 0.3, fh * 0.06), 0.1 + (i - 1) * 0.32)
        .add(c.hop(C, c.cOff * (1 - i / 4), 0.3, fh * 0.06), 0.35 + (i - 1) * 0.32);
    }
    tl.to([A.body, C.body], { scaleY: 1, scaleX: 1, duration: 0.2 }, 1.65);
    say(c, 'Shh!', 1.45, aX(c, 0), c.m.a.top - fh * 0.12, 0.45, 'say say--ink');

    // …then they start bickering across the sleeping tiger
    const shout = (text, at, who) => {
      const ch = who === 'a' ? A : C;
      const x = who === 'a' ? aX(c, 0) : cX(c, 0);
      say(c, text, at, x, (who === 'a' ? c.m.a.top : c.m.c.top) - fh * 0.12, 0.4);
      tl.add(c.hopInPlace(ch, fh * 0.14, 0.26), at);
    };
    shout('Mine!', 2.05, 'a');
    shout('Mine!!', 2.45, 'c');
    tl.to(ear, { keyframes: { rotation: [9, -4, 0] }, duration: 0.35, ease: 'none' }, 2.55);
    shout('MINE!', 2.85, 'a');
    tl.to(tail, { keyframes: { rotation: [20, -8, 0] }, duration: 0.5, ease: 'none' }, 3.0);

    // one eye opens… they freeze… it closes again
    c.eyes(3.35, 'open', 'right');
    tl.to(head, { rotation: 4, duration: 0.2 }, 3.35)
      .to([A.body, C.body], { scaleY: 1.12, scaleX: 0.9, duration: 0.1 }, 3.4)
      .to([A.body, C.body], { scaleY: 1, scaleX: 1, duration: 0.2 }, 3.9)
      .to(head, { rotation: 7, duration: 0.3 }, 3.85);
    c.eyes(3.9, 'shut', 'right');

    // …and they start again, louder
    say(c, '!@#$%', 4.1, cx, c.m.t.top - fh * 0.3, 0.45);
    tl.add(c.hopInPlace(A, fh * 0.2, 0.3), 4.1)
      .add(c.hopInPlace(C, fh * 0.2, 0.3), 4.15)
      .to(C.body, { rotation: 360, duration: 0.4 }, 4.2)
      .set(C.body, { rotation: 0 }, 4.61)
      .add(c.shake(6, 0.3), 4.15);

    // it wakes: eyes open, head up, a huge yawn… then the ROAR
    c.eyes(4.75, 'open');
    tl.to(head, { rotation: -6, duration: 0.4, ease: 'power2.out' }, 4.75)
      .to(jaw, { y: th * 0.075, duration: 0.45, ease: 'sine.out' }, 4.85)
      .to(tongue, { y: th * 0.035, duration: 0.45, ease: 'sine.out' }, 4.85)
      .to([jaw, tongue], { y: 0, duration: 0.12, ease: 'power2.in' }, 5.4)
      .to([A.body, C.body], { scaleY: 1.12, scaleX: 0.9, duration: 0.1 }, 4.8)
      .to(T.body, { scaleY: 1.04, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 4.85);
    const ROAR = 5.6;
    const afterRoar = c.roarAt(ROAR, cx);
    tl.to(A.root, { x: -c.knock, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }, ROAR + 0.05)
      .to(C.root, { x: c.knock, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }, ROAR + 0.05)
      .add(c.hopInPlace(A, fh * 0.5, 0.5), ROAR + 0.05)
      .add(c.hopInPlace(C, fh * 0.5, 0.5), ROAR + 0.05)
      .to([A.body, C.body], { scaleY: 1, scaleX: 1, rotation: 0, duration: 0.3 }, ROAR + 0.6);

    // a smile, a tail wag: "hop on"
    tl.to(head, { keyframes: { rotation: [-4, 2, 0] }, duration: 0.6, ease: 'sine.inOut' }, afterRoar)
      .to(tail, { keyframes: { rotation: [-14, 14, -10, 0] }, duration: 0.7, ease: 'sine.inOut' }, afterRoar);
    say(c, 'Hop on.', afterRoar + 0.05, ht.x, ht.y - fh * 0.15, 0.5, 'say say--ink');
    const ride = c.mount(afterRoar + 0.75, cx);
    c.exitRight(ride, cx);
    return { own: true };
  }

  /* --- 7 · head chef --------------------------------------------------------- */

  function chef(c) {
    const { tl, gsap, A, C, T, fh, cx, tw, th, head, tail, floorY, FOOD } = c;
    const tcx = cx + tw * 0.12;
    c.tigerOn(tcx);
    const hatW = tw * 0.2;
    c.held(T, 'hat', ART.chefHat, { width: hatW, left: tw * 0.875 - hatW / 2, top: th * 0.06 - hatW * 0.84, parent: head });

    // the handi sits at the tiger's tail, so it can stir with it
    const potW = th * 0.5;
    const potH = potW * 0.8;
    const potX = tcx - tw / 2 + tw * 0.03 + potW * 0.08;
    const potTop = floorY - potH * 0.68;
    const pot = c.prop('dish', ART.handi, potW);
    gsap.set(pot, { transformOrigin: '50% 100%' });
    pop(c, pot, 0.1, potX, floorY - potH / 2);

    // steam, rising all along
    const steamUntil = 9.6;
    for (let at = 0.4, i = 0; at < steamUntil; at += 0.32, i++) {
      const w = c.prop('dish', ART.steam, potW * 0.16);
      const sx = potX + potW * (((i * 37) % 5) - 2) * 0.12;
      tl.fromTo(w, { x: sx, y: potTop, autoAlpha: 1, scale: 0.6 },
        { y: potTop - th * 0.45, scale: 1.2, autoAlpha: 0, duration: 1.3, ease: 'sine.out', immediateRender: false }, at);
    }

    enter(c, 0, 0);
    say(c, 'Bring it on!', 1.25, headTop(c, tcx).x, c.m.t.top - fh * 0.15, 0.5);
    tl.to(head, { keyframes: { rotation: [5, -2, 5, 0] }, duration: 0.6, ease: 'sine.inOut' }, 1.25);

    // ingredients go in: sushi from Aiko, pizza over the tiger from Capiche
    const plop = (dish, from, at, height, dur) => {
      pop(c, dish, at - 0.15, from.x, from.y);
      arc(c, dish, from, { x: potX, y: potTop }, at, dur, height, 360);
      tl.to(dish, { autoAlpha: 0, duration: 0.08 }, at + dur)
        .to(pot, { scaleY: 0.9, scaleX: 1.06, duration: 0.08, yoyo: true, repeat: 1 }, at + dur);
      say(c, 'plop!', at + dur, potX, potTop - th * 0.2, 0.25, 'say say--ink say--small');
    };
    const ha = aHand(c, 0);
    const hc = cHand(c, 0);
    plop(c.prop('dish', FOOD.sushi, fh * 0.32), ha, 1.95, fh * 0.8, 0.6);
    plop(c.prop('dish', FOOD.pizza, fh * 0.32), hc, 2.7, th * 1.05, 0.8);
    plop(c.prop('dish', FOOD.sushi, fh * 0.32), ha, 3.55, fh * 0.7, 0.5);
    plop(c.prop('dish', FOOD.pizza, fh * 0.32), hc, 3.75, th * 0.95, 0.65);

    // it stirs with its tail, looking very pleased with itself
    tl.to(tail, { keyframes: { rotation: [-24, 16, -24, 16, -24, 0] }, duration: 1.3, ease: 'sine.inOut' }, 4.55)
      .to(pot, { keyframes: { rotation: [-4, 4, -4, 4, 0] }, duration: 1.3, ease: 'sine.inOut' }, 4.55)
      .to(head, { rotation: -3, duration: 0.3 }, 4.6);
    say(c, 'stir, stir…', 4.7, potX, potTop - th * 0.55, 0.6, 'say say--ink say--small');

    // sniff… taste… perfect!
    tl.to(head, { rotation: -8, duration: 0.3, ease: 'power2.out' }, 6.0);
    say(c, 'sniff sniff', 6.0, headTop(c, tcx).x, c.m.t.top - fh * 0.15, 0.35, 'say say--ink say--small');
    c.chomp(6.55, 2);
    const ROAR = 7.15;
    const afterRoar = c.roarAt(ROAR, tcx);
    say(c, 'Shabaash!', ROAR + 0.05, cx, c.m.t.top - fh * 0.42, 0.6);
    tl.add(c.hopInPlace(A, fh * 0.35, 0.4), ROAR + 0.1)
      .add(c.hopInPlace(C, fh * 0.35, 0.4), ROAR + 0.15);

    const ride = c.mount(afterRoar + 0.1, tcx);
    tl.to(pot, { autoAlpha: 0, scale: 0.6, duration: 0.3 }, ride + 0.3);
    c.exitRight(ride, tcx);
    return { own: true };
  }

  /* --- 8 · the host at the door ---------------------------------------------- */

  function host(c) {
    const { tl, gsap, A, C, T, fh, cx, W, tw, th, head, tail, floorY, bg, STEP } = c;
    const doorH = Math.max(th * 1.3, fh * 1.4);
    const doorW = doorH * (100 / 170);
    const frame = c.prop('dish', ART.doorFrame, doorW, bg);
    const leaf = c.prop('dish', ART.doorLeaf, doorW, bg);
    gsap.set([frame, leaf], { x: cx, y: floorY - doorH / 2, transformOrigin: '50% 100%' });
    gsap.set(leaf, { transformOrigin: '12% 50%' });
    tl.fromTo([frame, leaf], { autoAlpha: 1, scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: 'back.out(1.6)', immediateRender: false }, 0.05);

    // the tiger guards the door, in a bow tie
    c.tigerOn(cx);
    const bw = tw * 0.11;
    c.held(T, 'bowtie', ART.bowTie, { width: bw, left: tw * 0.79 - bw / 2, top: th * 0.49 });

    enter(c, 0, 0);
    // both rush for the door, and bounce off the tiger
    const bump = (ch, at, to) => {
      tl.add(c.hop(ch, to, 0.3, fh * 0.12), at)
        .add(c.squash(T, 0.05, 0.35), at + 0.3)
        .add(c.hop(ch, 0, 0.35, fh * 0.2), at + 0.32);
    };
    say(c, 'Me first!', 1.3, aX(c, 0), c.m.a.top - fh * 0.12, 0.4);
    bump(A, 1.45, c.ax(cx - tw / 2 + c.m.a.w * 0.2));
    say(c, 'No, me!', 1.85, cX(c, 0), c.m.c.top - fh * 0.12, 0.4);
    bump(C, 2.0, c.cxo(cx + tw / 2 - c.m.c.w * 0.2));
    tl.to(head, { keyframes: { rotation: [-4, 4, -3, 0] }, duration: 0.6, ease: 'sine.inOut' }, 2.2);
    say(c, '!@#$', 2.75, cx, floorY - doorH - fh * 0.22, 0.35);
    tl.add(c.hopInPlace(A, fh * 0.16, 0.25), 2.75).add(c.hopInPlace(C, fh * 0.16, 0.25), 2.8);

    // "Ahem." They freeze. The tiger bows, waves its tail at the door, and steps aside
    say(c, 'Ahem.', 3.25, headTop(c, cx).x, c.m.t.top - fh * 0.15, 0.4, 'say say--ink');
    c.chomp(3.25);
    tl.to([A.body, C.body], { scaleY: 1.1, scaleX: 0.92, duration: 0.1 }, 3.3)
      .to([A.body, C.body], { scaleY: 1, scaleX: 1, duration: 0.2 }, 3.9)
      .to(head, { rotation: 11, duration: 0.3, ease: 'power2.out' }, 3.75)
      .to(T.body, { rotation: 3, duration: 0.3 }, 3.75)
      .to([head, T.body], { rotation: 0, duration: 0.3 }, 4.25)
      .to(tail, { keyframes: { rotation: [-26, 0] }, duration: 0.6, ease: 'sine.inOut' }, 3.8);
    const aside = Math.min(cx + doorW / 2 + tw / 2 + 12, W - tw * 0.32);
    tl.add(c.walk(T, c.tx(aside), 3, STEP, th * 0.035), 4.45)
      .add(c.gait(3, STEP), 4.45)
      .add(c.hop(A, c.ax(cx - c.m.a.w * 0.5), 0.45, fh * 0.2), 4.7)
      .add(c.hop(C, c.cxo(cx + c.m.c.w * 0.5), 0.45, fh * 0.2), 4.85);

    // the door swings open; in they go, side by side
    tl.to(leaf, { scaleX: 0.1, duration: 0.5, ease: 'power2.inOut' }, 5.75);
    say(c, 'Welcome!', 5.8, headTop(c, aside).x, c.m.t.top - fh * 0.15, 0.5);
    tl.to([A.body, C.body], { rotation: (i) => (i ? -8 : 8), duration: 0.2 }, 6.2)
      .to(A.root, { x: c.ax(cx - doorW * 0.14), duration: 0.5, ease: 'power1.inOut' }, 6.45)
      .to(C.root, { x: c.cxo(cx + doorW * 0.14), duration: 0.5, ease: 'power1.inOut' }, 6.45)
      .to([A.body, C.body], { scale: 0.5, rotation: 0, duration: 0.5, ease: 'power1.in' }, 6.45)
      .to([A.lift, C.lift], { y: -fh * 0.06, duration: 0.5 }, 6.45)
      .to([A.root, C.root], { autoAlpha: 0, duration: 0.25 }, 6.75);

    // a happy roar; the door shuts; the host strolls off
    const afterRoar = c.roarAt(7.1, aside);
    tl.to(leaf, { scaleX: 1, duration: 0.25, ease: 'power3.in' }, afterRoar)
      .add(c.shake(7, 0.25), afterRoar + 0.25)
      .to([frame, leaf], { autoAlpha: 0, scale: 0.92, duration: 0.4 }, afterRoar + 0.65);
    c.exitRight(afterRoar + 0.4, aside);
    return { own: true };
  }

  /* --- 9 · the hungry guest -------------------------------------------------- */

  function guest(c) {
    const { tl, gsap, A, C, T, fh, cx, W, tw, th, tail, floorY, FOOD } = c;
    const GROW = 0.04;                                 // the tiger gets a little bigger with every dish
    const DISHES = 6;
    const tcx = cx - tw * 0.42;
    const tableW = fh * 0.95;
    const tableX = tcx + tw / 2 + (tw * GROW * DISHES) / 2 + tableW * 0.5 + 8;
    const topY = floorY - tableW * 0.52;
    const table = c.prop('dish', ART.table, tableW);
    tl.fromTo(table, { x: tableX, y: floorY + tableW * 0.3, autoAlpha: 1, scale: 0.6 },
      { y: floorY - tableW * 0.3, scale: 1, duration: 0.45, ease: 'back.out(1.8)', immediateRender: false }, 0.1);

    // the tiger strolls in and takes its seat
    gsap.set(T.lift, { y: 0, autoAlpha: 1 });
    gsap.set(T.shadow, { scale: 1, opacity: 1 });
    tl.add(c.walk(T, c.tx(tcx), 6, 0.3, th * 0.035), 0.25)
      .add(c.gait(6, 0.3), 0.25)
      .add(c.squash(T, 0.07, 0.4), 2.1)
      .to(tail, { keyframes: { rotation: [-12, 12, -8, 0] }, duration: 0.7 }, 2.2);
    say(c, 'Table for one!', 2.15, headTop(c, tcx).x, c.m.t.top - fh * 0.15, 0.55);

    // the two wait on the right and serve by tossing dishes onto the table
    const tableR = tableX + tableW / 2;
    const waitA = Math.min(tableR + c.m.a.w * 0.6, W - c.m.a.w * 0.5 - c.m.c.w - 4);
    const waitC = Math.min(waitA + (c.m.a.w + c.m.c.w) / 2 + 10, W - c.m.c.w * 0.5 - 4);
    gsap.set(A.root, { x: c.ax(W + c.m.a.w) });
    gsap.set(C.root, { x: c.cxo(W + c.m.c.w) });
    tl.add(c.hop(A, c.ax(waitA), 0.5, fh * 0.3), 2.3)
      .add(c.hop(C, c.cxo(waitC), 0.5, fh * 0.3), 2.4);

    // where the mouth is once the tiger has grown (it grows from its feet)
    const mouth0 = c.mouthAt(tcx);
    const mouthFor = (k) => ({ x: tcx + (mouth0.x - tcx) * k, y: floorY - (floorY - mouth0.y) * k + th * 0.04 * k });
    let size = 1;
    const round = (ch, food, at, n = 1) => {
      const isA = ch === A;
      const hand = isA ? aHand(c, c.ax(waitA)) : cHand(c, c.cxo(waitC));
      tl.add(c.hopInPlace(ch, fh * 0.18, 0.3), at);
      for (let k = 0; k < n; k++) {
        const d = c.prop('dish', food, fh * 0.3);
        const spot = { x: tableX + (k - (n - 1) / 2) * tableW * 0.3, y: topY };
        pop(c, d, at + 0.1 + k * 0.12, hand.x, hand.y);
        arc(c, d, hand, spot, at + 0.15 + k * 0.12, 0.4, fh * 0.35, 0);
        // gobbled up
        const eat = at + 0.75 + k * 0.28;
        arc(c, d, spot, mouthFor(size), eat, 0.22, fh * 0.15, 0);
        tl.to(d, { autoAlpha: 0, scale: 0.4, duration: 0.06 }, eat + 0.22);
        c.chomp(eat + 0.2);
        size += GROW;
        tl.to(T.body, { scale: size, duration: 0.2, ease: 'back.out(3)' }, eat + 0.3);
      }
      say(c, 'Mmm!', at + 0.95 + (n - 1) * 0.28, headTop(c, tcx).x, c.m.t.top - fh * 0.2, 0.3, 'say say--ink say--small');
    };
    round(A, FOOD.sushi, 2.95);
    round(C, FOOD.pizza, 4.1);
    round(A, FOOD.sushi, 5.2, 2);
    round(C, FOOD.pizza, 6.5, 2);

    // full: a happy roar (well… a burp)
    const ROAR = 8.6;
    say(c, '*burp*', ROAR - 0.05, headTop(c, tcx).x, c.m.t.top - fh * 0.3, 0.5);
    const afterRoar = c.roarAt(ROAR, tcx, { base: size });
    // the two high-five
    const mid = (waitA + waitC) / 2;
    tl.add(c.hop(A, c.ax(mid - c.m.a.w * 0.45), 0.3, fh * 0.3), afterRoar)
      .add(c.hop(C, c.cxo(mid + c.m.c.w * 0.45), 0.3, fh * 0.3), afterRoar);
    say(c, 'High five!', afterRoar + 0.25, mid, c.m.a.top - fh * 0.25, 0.4);
    const ride = c.mount(afterRoar + 0.8, tcx);
    tl.to(table, { autoAlpha: 0, scale: 0.7, duration: 0.3 }, ride - 0.2);
    c.exitRight(ride, tcx);
    return { own: true };
  }

  /* --- 10 · the storybook --------------------------------------------------- */

  function storybook(c) {
    const { tl, gsap, A, C, T, fh, cx, W, tw, th, floorY, korean, italian } = c;
    const bookW = Math.min(W * 0.62, fh * 3.1);
    const bookH = bookW / 2.4;
    const bookY = floorY - bookH / 2 - fh * 0.04;
    const spreads = [
      { l: ['seoulTower', 'palace'], lt: 'Korea', r: ['mugunghwa', 'lantern'], rt: 'Aiko' },
      { l: ['colosseum', 'pisa'], lt: 'Italy', r: ['gondola', 'vespa'], rt: 'Capiche' },
      { l: ['tajMahal', 'lotus'], lt: 'India', r: ['peacock', 'elephant'], rt: 'Beshak' },
    ];
    const page = (side, sp, z) => `<span class="book__page book__page--${side}" style="z-index:${z}">
      <span class="book__art">${sp[side].map(icon).join('')}</span><span class="book__label">${sp[side + 't']}</span></span>`;
    const book = c.prop('book', `
      <span class="book__back book__back--l"></span><span class="book__back book__back--r"></span>
      ${spreads.map((sp, k) => page('r', sp, 10 - k)).join('')}
      ${spreads.map((sp, k) => page('l', sp, 10 + k)).join('')}
      <span class="book__spine"></span>
      <span class="book__cover"><img src="assets/tiger.png" alt=""><b>Bookends</b></span>`, bookW);
    const q = (sel) => [...book.querySelectorAll(sel)];
    const [pr0, pr1, pr2] = q('.book__page--r');
    const [pl0, pl1, pl2] = q('.book__page--l');
    const backL = book.querySelector('.book__back--l');
    const cover = book.querySelector('.book__cover');
    gsap.set([pl0, pl1, pl2, backL], { scaleX: 0, transformOrigin: '100% 50%' });
    gsap.set([pr0, pr1, pr2, cover], { transformOrigin: '0% 50%' });

    // everyone comes out in front of the book
    gsap.set([A.root, C.root, T.root], { zIndex: 6 });

    // the closed book appears, wobbles, and opens
    tl.fromTo(book, { x: cx - bookW / 4, y: bookY, autoAlpha: 1, scale: 0.5 },
      { scale: 1, duration: 0.5, ease: 'back.out(1.7)', immediateRender: false }, 0.1)
      .to(book, { keyframes: { rotation: [-3, 3, -2, 0] }, duration: 0.5 }, 0.65)
      .to(cover, { scaleX: 0, duration: 0.25, ease: 'power2.in' }, 1.2)
      .to(book, { x: cx, duration: 0.5, ease: 'power2.inOut' }, 1.2)
      .to([pl0, backL], { scaleX: 1, duration: 0.25, ease: 'power2.out' }, 1.45);

    // turn a page: the right page folds into the spine, the next left page unfolds from it
    const flip = (from, to, at) => {
      tl.to(from, { scaleX: 0, duration: 0.25, ease: 'power2.in' }, at)
        .to(to, { scaleX: 1, duration: 0.25, ease: 'power2.out' }, at + 0.25);
    };
    // jump out of the book: start tiny at the page, arc out to `toX`
    const emerge = (ch, rootX, fromX, at, isTiger = false) => {
      const h = isTiger ? th : fh;
      tl.set(ch.root, { x: rootX(fromX), autoAlpha: 1 }, at)
        .set(ch.lift, { autoAlpha: 1 }, at)
        .fromTo(ch.body, { scale: 0.15 }, { scale: 1, duration: 0.6, ease: 'power2.out', immediateRender: false }, at)
        .fromTo(ch.lift, { y: bookY - floorY + h * 0.08 }, {
          keyframes: [
            { y: -bookH * 0.9, duration: 0.3, ease: 'power2.out' },
            { y: 0, duration: 0.35, ease: 'power2.in' },
          ],
          immediateRender: false,
        }, at);
    };

    // Korea: Aiko hops out to the left
    tl.to(korean, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.05 }, 1.6);
    gsap.set([A.root, C.root], { autoAlpha: 0 });
    emerge(A, c.ax, cx + bookW / 4, 2.0);
    tl.to(A.root, { x: 0, duration: 0.65, ease: 'power1.out' }, 2.0).add(c.squash(A, 0.15), 2.65);

    // Italy: Capiche hops out to the right
    flip(pr0, pl1, 3.0);
    tl.to(italian, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.05 }, 3.4);
    emerge(C, c.cxo, cx + bookW / 4, 3.6);
    tl.to(C.root, { x: 0, duration: 0.65, ease: 'power1.out' }, 3.6).add(c.squash(C, 0.15), 4.25);

    // India: the tiger leaps out and roars
    flip(pr1, pl2, 4.6);
    gsap.set(T.root, { x: 0 });
    gsap.set(T.lift, { autoAlpha: 0 });
    gsap.set(T.shadow, { scale: 1, opacity: 1 });
    emerge(T, (x) => x - cx, cx, 5.2, true);
    tl.add(c.squash(T, 0.2), 5.85).add(c.shake(14, 0.35), 5.85);
    const afterRoar = c.roarAt(6.3, cx);

    // the two hold the tiger between them, like bookends
    const pressA = c.ax(cx - tw / 2 - c.m.a.w * 0.3);
    const pressC = c.cxo(cx + tw / 2 + c.m.c.w * 0.3);
    tl.add(c.hop(A, pressA, 0.4, fh * 0.35), afterRoar)
      .add(c.hop(C, pressC, 0.4, fh * 0.35), afterRoar)
      .to(A.body, { rotation: 13, duration: 0.25, ease: 'back.out(2)' }, afterRoar + 0.4)
      .to(C.body, { rotation: -13, duration: 0.25, ease: 'back.out(2)' }, afterRoar + 0.4)
      .to(T.body, { scaleX: 0.93, duration: 0.15, yoyo: true, repeat: 1 }, afterRoar + 0.5);
    say(c, 'Bookends!', afterRoar + 0.55, cx, c.m.t.top - fh * 0.32, 0.75);

    // …and back into the book they go; it closes, and the title takes its place
    const IN = afterRoar + 1.75;
    tl.to([A.body, C.body], { rotation: 0, duration: 0.15 }, IN - 0.15);
    [[A, c.ax], [C, c.cxo], [T, (x) => x - cx]].forEach(([ch, rootX], i) => {
      tl.to(ch.root, { x: rootX(cx), duration: 0.5, ease: 'power2.in' }, IN + i * 0.08)
        .to(ch.lift, { y: bookY - floorY, duration: 0.5, ease: 'power2.in' }, IN + i * 0.08)
        .to(ch.body, { scale: 0.1, duration: 0.5, ease: 'power2.in' }, IN + i * 0.08)
        .set(ch.root, { autoAlpha: 0 }, IN + 0.55 + i * 0.08);
    });
    const SHUT = IN + 0.8;
    tl.to([pl0, pl1, pl2, backL], { scaleX: 0, duration: 0.2, ease: 'power2.in' }, SHUT)
      .to(cover, { scaleX: 1, duration: 0.2, ease: 'power2.out' }, SHUT + 0.2)
      .to(book, { x: cx - bookW / 4, duration: 0.4, ease: 'power2.inOut' }, SHUT)
      .add(c.shake(9, 0.25), SHUT + 0.4)
      .to(book, { autoAlpha: 0, scale: 0.85, y: bookY - fh * 0.2, duration: 0.45, ease: 'power2.in' }, SHUT + 1.0);
    c.titleIn(SHUT + 1.2);
    return { own: true, ownCountries: true };
  }

  /* --- 11 · the judge ------------------------------------------------------- */

  function judge(c) {
    const { tl, gsap, A, C, T, fh, cx, th, head, ear, tail } = c;
    const { s1, s2, pie, aSt, cSt } = cookPhase(c);

    // the judge arrives; the cooks step aside with their dishes
    const J = 4.95;
    tl.set(T.lift, { y: 0, autoAlpha: 1 }, J)
      .set(T.shadow, { scale: 1, opacity: 1 }, J)
      .add(c.walk(T, c.tx(cx), 6, 0.3, th * 0.035), J)
      .add(c.gait(6, 0.3), J)
      .to([A.body, C.body], { rotation: 0, duration: 0.2 }, J)
      .add(c.hop(A, 0, 0.45, fh * 0.25), J + 0.1)
      .add(c.hop(C, 0, 0.45, fh * 0.25), J + 0.15)
      .to(s2, { autoAlpha: 0, duration: 0.15 }, J);
    const ha = aHand(c, 0);
    const hc = cHand(c, 0);
    const aHold = { x: ha.x, y: ha.y - fh * 0.1 };
    const cHold = { x: hc.x, y: c.m.c.top - fh * 0.12 };
    arc(c, s1, aHand(c, aSt), aHold, J + 0.1, 0.45, fh * 0.25, 0);
    arc(c, pie, { x: cX(c, cSt), y: c.m.c.top - fh * 0.12 }, cHold, J + 0.15, 0.45, fh * 0.25, 0);
    const ARRIVE = J + 1.85;
    tl.add(c.squash(T, 0.07, 0.4), ARRIVE);
    say(c, 'Judge Beshak!', ARRIVE, headTop(c, cx).x, c.m.t.top - fh * 0.15, 0.6);

    // taste one, think… taste the other, think…
    const mouth = c.mouthAt(cx);
    const taste = (dish, from, at, tilt) => {
      arc(c, dish, from, { x: mouth.x, y: mouth.y + th * 0.04 }, at, 0.55, th * 0.5, 0);
      tl.to(dish, { autoAlpha: 0, scale: 0.4, duration: 0.06 }, at + 0.55);
      c.chomp(at + 0.5, 2);
      tl.to(head, { keyframes: { rotation: [tilt, tilt, 0] }, duration: 0.9, ease: 'sine.inOut' }, at + 1.0)
        .to(ear, { rotation: 8, duration: 0.07, yoyo: true, repeat: 3 }, at + 1.1);
      say(c, 'Hmm…', at + 1.0, headTop(c, cx).x, c.m.t.top - fh * 0.15, 0.5, 'say say--ink');
    };
    taste(s1, aHold, ARRIVE + 0.8, 5);
    taste(pie, cHold, ARRIVE + 2.45, -5);

    // the verdict: 10 and 10
    const V = ARRIVE + 4.0;
    const cards = [c.prop('dish', ART.card, fh * 0.32), c.prop('dish', ART.card, fh * 0.32)];
    const above = [{ x: aX(c, 0), y: c.m.a.top - fh * 0.3 }, { x: cX(c, 0), y: c.m.c.top - fh * 0.3 }];
    cards.forEach((card, i) => {
      pop(c, card, V + i * 0.35, mouth.x, mouth.y);
      arc(c, card, mouth, above[i], V + i * 0.35, 0.5, th * 0.4, 0);
      tl.to(card, { keyframes: { rotation: [-8, 8, 0] }, duration: 0.4 }, V + i * 0.35 + 0.5);
    });
    say(c, 'A tie!', V + 0.95, cx, c.m.t.top - fh * 0.35, 0.6);
    tl.add(c.hopInPlace(A, fh * 0.4, 0.45), V + 1.0)
      .add(c.hopInPlace(C, fh * 0.4, 0.45), V + 1.05)
      .to(A.body, { rotation: 360, duration: 0.45 }, V + 1.0)
      .to(C.body, { rotation: -360, duration: 0.45 }, V + 1.05)
      .set([A.body, C.body], { rotation: 0 }, V + 1.55)
      .to(tail, { keyframes: { rotation: [-14, 14, 0] }, duration: 0.5 }, V + 1.0)
      .to(cards, { autoAlpha: 0, scale: 0.6, duration: 0.25 }, V + 1.7);

    const ride = c.mount(V + 1.85, cx);
    const afterRoar = c.roarAt(ride, cx);
    c.exitRight(afterRoar, cx);
    return { own: true };
  }

  return { fight, cookoff, sharing, noodle, dance, race, sleeping, chef, host, guest, storybook, judge };
})();

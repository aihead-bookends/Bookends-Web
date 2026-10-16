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
    // a thali of Holi colours: pink, yellow, green, blue
    thali: `<svg viewBox="0 0 120 44" stroke="#111" stroke-width="2.6" stroke-linejoin="round">
      <ellipse cx="60" cy="36" rx="56" ry="7" fill="#E9A23B"/>
      <path d="M13 36c4-15 19-15 23 0z" fill="#E83E8C"/>
      <path d="M34 36c4-18 21-18 25 0z" fill="#F6C453"/>
      <path d="M57 36c4-15 19-15 23 0z" fill="#2FA36B"/>
      <path d="M78 36c4-18 21-18 25 0z" fill="#3D7DD8"/></svg>`,
    // an old box camera on a tripod, lens to the right
    camera: `<svg viewBox="0 0 80 130" stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <path d="M30 52L10 128M30 52l20 76M30 52v76" fill="none"/>
      <rect x="10" y="9" width="12" height="9" rx="2" fill="#FBF6EC"/>
      <path d="M46 24l20-8v40l-20-8z" fill="#C8553D"/>
      <rect x="6" y="16" width="42" height="38" rx="5" fill="#3A2E28"/>
      <circle cx="70" cy="36" r="9" fill="#FBF6EC"/><circle cx="70" cy="36" r="4" fill="#111"/></svg>`,
    flashStar: `<svg viewBox="0 0 100 100"><polygon points="50,2 60,36 98,30 68,54 88,96 50,70 12,96 32,54 2,30 40,36"
      fill="#FFF7C2" stroke="#111" stroke-width="3" stroke-linejoin="round"/></svg>`,
    // Navratri: the garbo (a clay lamp pot with holes, a diya burning on top)
    garbo: `<svg viewBox="0 0 80 112" stroke="#111" stroke-width="2.4" stroke-linejoin="round">
      <path class="garbo__flame" d="M40 4c7 9 8 16 0 22c-8-6-7-13 0-22z" fill="#F6C453"/>
      <path d="M26 28q14 9 28 0l-3-3H29z" fill="#C8553D"/>
      <rect x="32" y="31" width="16" height="8" fill="#A8432F"/>
      <ellipse cx="40" cy="72" rx="33" ry="34" fill="#C8553D"/>
      <path d="M10 60q30 10 60 0M8 80q32 10 64 0" fill="none" stroke="#F6C453" stroke-width="3"/>
      <g fill="#FFE58A" stroke="none">
        <circle cx="40" cy="49" r="2.6"/><circle cx="28" cy="51" r="2.2"/><circle cx="52" cy="51" r="2.2"/>
        <circle cx="26" cy="70" r="3"/><circle cx="40" cy="71" r="3.4"/><circle cx="54" cy="70" r="3"/>
        <circle cx="19" cy="91" r="2.6"/><circle cx="33" cy="94" r="3"/><circle cx="47" cy="94" r="3"/><circle cx="61" cy="91" r="2.6"/>
      </g>
      <ellipse cx="40" cy="106" rx="16" ry="4" fill="#8E3A28"/></svg>`,
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
    [0.5, 0.62, 0.97, 1.09].forEach((t) => c.cue(t, 'hop'));      // the two land from their hops
    return 1.2;
  }

  // both rush to the centre and the cloud forms around them (`gentle`: a poof, not a punch)
  function charge(c, at, spin = 0, gentle = false) {
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
    c.cue(at + 0.12, 'whoosh');
    c.cue(clash, gentle ? 'poof' : 'punch');
    return clash;
  }

  // the recording for each spoken line: assets/audio/voices/<speaker>-<key>.m4a (js/sound.js)
  const LINE_KEYS = {
    'Mine!': 'mine', 'Mine!!': 'mine', 'MINE!': 'mine', 'Shh!': 'shh', 'Me first!': 'me-first', 'No, me!': 'no-me',
    'Ready… cook!': 'ready-cook', 'Bring it on!': 'bring-it-on', 'Shabaash!': 'shabaash', 'Ahem.': 'ahem',
    'Welcome!': 'welcome', 'Hop on.': 'hop-on', 'Table for one!': 'table-for-one', 'Table for one?': 'table-for-one-q',
    'Mmm!': 'mmm', 'Judge Beshak!': 'judge-beshak', 'Hmm…': 'hmm', 'A tie!': 'a-tie', 'High five!': 'high-five',
    'Bookends!': 'bookends', 'Happy Holi!': 'happy-holi', 'Ha ha!': 'ha-ha', 'ha ha!': 'ha-ha', 'Smile!': 'smile',
    'Say paneer!': 'say-paneer', 'PANEER!': 'paneer', 'hee!': 'hee', 'hihi!': 'hihi', 'hahaha!': 'hahaha',
    'HA HA HA!': 'hahaha', 'Friends?': 'friends', 'Dandiya!': 'dandiya', 'Faster!': 'faster', 'Faster!!': 'faster',
    'Shubh Navratri!': 'shubh-navratri',
  };
  // a speaker ('aiko', 'capiche', 'tiger' or 'both') says `text`: their recording, or gibberish for
  // lines that have none (!@#$%, ?!)
  function voice(c, who, text, at) {
    const key = LINE_KEYS[text];
    const loud = /[A-Z]{3}/.test(text) || text.endsWith('!!');
    if (!key) {
      const words = /[a-z]/i.test(text);
      const syllables = words ? (text.match(/[aeiouy]+/gi) || []).length : text.length;
      c.cue(at, 'babble', who, Math.max(1, Math.min(5, syllables)), { loud, fast: !words });
      return;
    }
    c.cue(at, 'say', who === 'both' ? [`aiko-${key}`, `capiche-${key}`] : `${who}-${key}`, { loud, gap: 0.08 });
  }

  // a word or two popping up over the stage; `who` says it out loud
  function say(c, text, at, x, y, hold = 0.55, cls = 'say', who = null) {
    if (who) voice(c, who, text, at);
    const el = c.prop(cls, text);
    c.tl.fromTo(el, { x, y, autoAlpha: 1, scale: 0, rotation: -12 },
      { scale: 1, rotation: 0, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, at)
      .to(el, { autoAlpha: 0, scale: 1.25, duration: 0.22, ease: 'power2.in' }, at + 0.3 + hold);
    return el;
  }

  // something tossed from one point to another in an arc (with a little whoosh)
  function arc(c, el, from, to, at, dur, height, spin = 0) {
    c.cue(at, 'toss');
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

  function pop(c, el, at, x, y, rotation = 0) {
    c.cue(at, 'pop');
    return c.tl.fromTo(el, { x, y, rotation, autoAlpha: 1, scale: 0 },
      { scale: 1, duration: 0.25, ease: 'back.out(2.5)', immediateRender: false }, at);
  }

  const gone = (c, els, at) => c.tl.to(els, { autoAlpha: 0, scale: 0.4, duration: 0.2, ease: 'power2.in' }, at);

  // a stand-off at aFace/cFace: both bob on their toes, a spark flies between them
  function faceoff(c, at) {
    const { tl, A, C, fh, floorY, bolt } = c;
    tl.to([A.lift, C.lift], { y: -fh * 0.04, duration: 0.16, ease: 'sine.inOut', yoyo: true, repeat: 5, stagger: 0.08 }, at)
      .to(A.body, { rotation: -7, duration: 0.3 }, at)
      .to(C.body, { keyframes: { rotation: [8, -8, 8, -6, 0] }, duration: 0.7, ease: 'none' }, at + 0.15)
      .fromTo(bolt, { autoAlpha: 1, scale: 0, rotation: -25, y: floorY - fh * 0.6 - fh * 0.4 },
        { scale: 1, rotation: 0, y: floorY - fh * 0.6, duration: 0.18, ease: 'back.out(2.5)', immediateRender: false }, at + 0.2)
      .to(bolt.firstElementChild, { keyframes: { opacity: [0.25, 1, 0.4, 1] }, duration: 0.3, ease: 'none' }, at + 0.38)
      .add(c.shake(7, 0.22), at + 0.25)
      .to(bolt, { autoAlpha: 0, scale: 1.35, duration: 0.25, ease: 'power2.in' }, at + 0.85);
    c.cue(at + 0.28, 'thunder');                                   // the bolt strikes
  }

  /* --- 0 · fight (the original) --------------------------------------------- */

  function fight(c) {
    enter(c);
    faceoff(c, 1.25);
    trade(c, 2.15, 3.25);
    return { clash: charge(c, 4.3) };
  }

  // one hit each, from aFace/cFace: Aiko lands a sushi, Capiche slaps back with a pizza
  function trade(c, HIT1, HIT2) {
    const { tl, A, C } = c;

    // Aiko strikes, Capiche spins away
    const IMPACT1 = HIT1 + 0.3;
    c.cue(HIT1 + 0.16, 'whoosh');
    c.cue(IMPACT1, 'punch');                                       // sushi!
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
    c.cue(HIT2 + 0.16, 'whoosh');
    c.cue(IMPACT2, 'slap');                                        // pizza!
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
  }

  /* --- 1 · cook-off: Aiko flips sushi, Capiche spins pizza dough ------------ */

  function cookPhase(c) {
    const { tl, A, C, fh, cx, W, FOOD } = c;
    const aSt = c.ax(cx - W * 0.17);
    const cSt = c.cxo(cx + W * 0.17);
    enter(c, aSt, cSt);
    say(c, 'Ready… cook!', 1.25, cx, c.m.a.top - fh * 0.05, 0.5, 'say', 'both');
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

    // the sounds of the cooking: catches, the dough spinning, the spin, the pizza landing
    [2.82, 3.81, 4.25, 4.3, 4.75].forEach((t) => c.cue(t, 'tok'));
    c.cue(2.55, 'whoosh');
    c.cue(3.55, 'whoosh');
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
    [0.36, 0.51, 0.72, 0.87, 1.08, 1.23].forEach((t) => c.cue(t, 'step', 0.16));

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
    [3.25, 4.35, 5.4, 5.45].forEach((t) => c.cue(t, 'tok'));      // dishes caught, then set on the table
    c.cue(4.6, 'rise');
    c.cue(5.45, 'sparkle');

    // a hug: both hop in behind the table and the cloud swallows them
    tl.add(c.hop(A, c.aMid, 0.4, fh * 0.35), 6.0)
      .add(c.hop(C, c.cMid, 0.4, fh * 0.35), 6.0);
    const clash = 6.38;
    tl.to(c.cloud, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(2)' }, clash - 0.04)
      .add(c.shake(6, 0.22), clash);
    gone(c, [table, sushi, pizza], clash - 0.04);
    c.cue(6.0, 'whoosh');
    c.cue(clash, 'poof');
    // a happy cloud: giggles and sparkles instead of a scuffle
    [0.5, 1.6, 2.7, 3.6].forEach((d, i) => c.cue(clash + d, i % 2 ? 'sparkle' : 'babble', 'both', 3, { fast: true }));

    const f = FOOD;
    return { clash, scuffle: false, bits: ['♥', '✦', f.sushi, '♥', '✶', f.pizza, '♥', '✦', '♥', f.sushi, '✶', '♥', f.pizza, '✦'] };
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
    say(c, 'Mine!', 1.45, cx, c.m.a.top - fh * 0.1, 0.4, 'say', 'both');
    c.cue(1.3, 'boing');

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
      c.cue(at, 'creak');                                           // the noodle stretches
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
    c.cue(SNAP, 'snap');
    c.cue(SNAP + 0.3, 'thud');                                     // both land on their bottoms
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
      c.cue(at, 'note', [0, 2, 4, 3, 1, 2, 4, 0][i]);                // a little tune
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
    [1.65, 3.4].forEach((t) => c.cue(t, 'whoosh'));                 // Aiko's spin, Capiche's backflip
    [2.15, 3.95, 4.5, 4.7, 4.9, 5.1].forEach((t) => c.cue(t, 'hop'));

    // and spin into each other; the cloud keeps the tune going
    const clash = charge(c, 5.2, 720, true);
    for (let i = 0; i < 10; i++) c.cue(clash + 0.2 + i * 0.4, 'note', [4, 3, 2, 0, 1, 2, 3, 4, 2, 0][i]);
    return { clash, scuffle: false, bits: [ART.note, '✦', ART.notes, '★', ART.note, '✶', ART.notes, '✦', ART.note, '★', ART.notes, '✦', ART.note, '✶'] };
  }

  /* --- 5 · race to serve the table ----------------------------------------- */

  function race(c) {
    const { tl, A, C, fh, cx, FOOD, floorY } = c;
    const tableW = fh * 0.95;
    const table = c.prop('dish', ART.table, tableW);
    tl.fromTo(table, { x: cx, y: floorY + tableW * 0.3, autoAlpha: 1, scale: 0.6 },
      { y: floorY - tableW * 0.3, scale: 1, duration: 0.45, ease: 'back.out(1.8)', immediateRender: false }, 0.1);
    say(c, 'Table for one?', 0.45, cx, floorY - tableW * 1.05, 0.6, 'say', 'tiger');
    c.cue(0.1, 'rise');

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
    for (let i = 1; i <= 7; i++) {
      c.cue(0.9 + i * 0.24, 'step', 0.14);
      c.cue(0.95 + i * 0.24, 'step', 0.12);
    }
    tl.to([tA, tC], { rotation: (i) => (i ? -7 : 7), duration: 0.12, yoyo: true, repeat: 13, ease: 'sine.inOut' }, 0.9)
      .add(c.squash(A, 0.12, 0.35), 2.6).add(c.squash(C, 0.12, 0.35), 2.65);

    // they arrive at the same moment
    say(c, '!!', 2.75, cx, c.m.a.top - fh * 0.15, 0.35, 'say', 'both');
    tl.to(A.body, { rotation: -8, duration: 0.18 }, 3.0)
      .to(C.body, { rotation: 8, duration: 0.18 }, 3.0)
      .to([A.body, C.body], { rotation: 0, duration: 0.15 }, 3.3);

    // both lunge for the table: bump, plates fly, cloud
    const clash = charge(c, 3.5);
    tl.to([tA, tC], { y: -fh * 1.1, rotation: (i) => (i ? -220 : 220), duration: 0.5, ease: 'power2.out' }, clash - 0.05)
      .to([tA, tC], { autoAlpha: 0, duration: 0.15 }, clash + 0.3)
      .to(table, { rotation: 14, y: `+=${fh * 0.05}`, duration: 0.2 }, clash - 0.05);
    gone(c, [table], clash + 0.05);
    c.cue(clash + 0.15, 'crash');                                   // the plates go flying

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
    say(c, 'Shh!', 1.45, aX(c, 0), c.m.a.top - fh * 0.12, 0.45, 'say say--ink', 'aiko');
    [0.1, 1.5, 2.9].forEach((t) => c.cue(t, 'snore'));             // the tiger snores
    [0.4, 0.65, 0.72, 0.97, 1.04, 1.29, 1.36, 1.61].forEach((t) => c.cue(t, 'step', 0.06)); // tiptoes

    // …then they start bickering across the sleeping tiger
    const shout = (text, at, who) => {
      const ch = who === 'a' ? A : C;
      const x = who === 'a' ? aX(c, 0) : cX(c, 0);
      say(c, text, at, x, (who === 'a' ? c.m.a.top : c.m.c.top) - fh * 0.12, 0.4, 'say', who === 'a' ? 'aiko' : 'capiche');
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
    c.cue(3.45, 'gulp');                                           // uh-oh

    // …and they start again, louder
    say(c, '!@#$%', 4.1, cx, c.m.t.top - fh * 0.3, 0.45, 'say', 'both');
    c.cue(4.2, 'whoosh');
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
    c.cue(4.85, 'babble', 'tiger', 1, { sigh: true });            // a huge yawn
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
    say(c, 'Hop on.', afterRoar + 0.05, ht.x, ht.y - fh * 0.15, 0.5, 'say say--ink', 'tiger');
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
    [0.4, 2.0, 3.4, 5.0, 6.4].forEach((t) => c.cue(t, 'steam'));

    enter(c, 0, 0);
    say(c, 'Bring it on!', 1.25, headTop(c, tcx).x, c.m.t.top - fh * 0.15, 0.5, 'say', 'tiger');
    tl.to(head, { keyframes: { rotation: [5, -2, 5, 0] }, duration: 0.6, ease: 'sine.inOut' }, 1.25);

    // ingredients go in: sushi from Aiko, pizza over the tiger from Capiche
    const plop = (dish, from, at, height, dur) => {
      pop(c, dish, at - 0.15, from.x, from.y);
      arc(c, dish, from, { x: potX, y: potTop }, at, dur, height, 360);
      tl.to(dish, { autoAlpha: 0, duration: 0.08 }, at + dur)
        .to(pot, { scaleY: 0.9, scaleX: 1.06, duration: 0.08, yoyo: true, repeat: 1 }, at + dur);
      say(c, 'plop!', at + dur, potX, potTop - th * 0.2, 0.25, 'say say--ink say--small');
      c.cue(at + dur, 'plop');
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
    c.cue(4.55, 'bubble', 1.4);

    // sniff… taste… perfect!
    tl.to(head, { rotation: -8, duration: 0.3, ease: 'power2.out' }, 6.0);
    say(c, 'sniff sniff', 6.0, headTop(c, tcx).x, c.m.t.top - fh * 0.15, 0.35, 'say say--ink say--small');
    c.cue(6.0, 'sniff');
    c.chomp(6.55, 2);
    [6.55, 6.77].forEach((t) => c.cue(t, 'munch'));
    const ROAR = 7.15;
    const afterRoar = c.roarAt(ROAR, tcx);
    // "Shabaash!" (well done!), said once the roar has died down a little
    say(c, 'Shabaash!', ROAR + 0.05, cx, c.m.t.top - fh * 0.42, 1.1);
    voice(c, 'tiger', 'Shabaash!', ROAR + 0.9);
    [ROAR + 0.5, ROAR + 0.55].forEach((t) => c.cue(t, 'hop'));
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
    c.cue(0.05, 'rise');

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
    say(c, 'Me first!', 1.3, aX(c, 0), c.m.a.top - fh * 0.12, 0.4, 'say', 'aiko');
    bump(A, 1.45, c.ax(cx - tw / 2 + c.m.a.w * 0.2));
    say(c, 'No, me!', 1.85, cX(c, 0), c.m.c.top - fh * 0.12, 0.4, 'say', 'capiche');
    bump(C, 2.0, c.cxo(cx + tw / 2 - c.m.c.w * 0.2));
    [1.75, 2.3].forEach((t) => c.cue(t, 'bonk'));                 // bounced off the tiger
    tl.to(head, { keyframes: { rotation: [-4, 4, -3, 0] }, duration: 0.6, ease: 'sine.inOut' }, 2.2);
    say(c, '!@#$', 2.75, cx, floorY - doorH - fh * 0.22, 0.35, 'say', 'both');
    tl.add(c.hopInPlace(A, fh * 0.16, 0.25), 2.75).add(c.hopInPlace(C, fh * 0.16, 0.25), 2.8);

    // "Ahem." They freeze. The tiger bows, waves its tail at the door, and steps aside
    say(c, 'Ahem.', 3.25, headTop(c, cx).x, c.m.t.top - fh * 0.15, 0.4, 'say say--ink', 'tiger');
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
    c.steps(4.45, 3, STEP, 0.22);
    [5.15, 5.3].forEach((t) => c.cue(t, 'hop'));

    // the door swings open; in they go, side by side
    tl.to(leaf, { scaleX: 0.1, duration: 0.5, ease: 'power2.inOut' }, 5.75);
    c.cue(5.75, 'creak');
    say(c, 'Welcome!', 5.8, headTop(c, aside).x, c.m.t.top - fh * 0.15, 0.5, 'say', 'tiger');
    c.cue(6.75, 'sparkle');
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
    c.cue(afterRoar + 0.22, 'slam');                               // the door shuts
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
    c.cue(0.1, 'rise');

    // the tiger strolls in and takes its seat
    gsap.set(T.lift, { y: 0, autoAlpha: 1 });
    gsap.set(T.shadow, { scale: 1, opacity: 1 });
    tl.add(c.walk(T, c.tx(tcx), 6, 0.3, th * 0.035), 0.25)
      .add(c.gait(6, 0.3), 0.25)
      .add(c.squash(T, 0.07, 0.4), 2.1)
      .to(tail, { keyframes: { rotation: [-12, 12, -8, 0] }, duration: 0.7 }, 2.2);
    c.steps(0.25, 6, 0.3, 0.2);
    say(c, 'Table for one!', 2.15, headTop(c, tcx).x, c.m.t.top - fh * 0.15, 0.55, 'say', 'tiger');

    // the two wait on the right and serve by tossing dishes onto the table
    const tableR = tableX + tableW / 2;
    const waitA = Math.min(tableR + c.m.a.w * 0.6, W - c.m.a.w * 0.5 - c.m.c.w - 4);
    const waitC = Math.min(waitA + (c.m.a.w + c.m.c.w) / 2 + 10, W - c.m.c.w * 0.5 - 4);
    gsap.set(A.root, { x: c.ax(W + c.m.a.w) });
    gsap.set(C.root, { x: c.cxo(W + c.m.c.w) });
    tl.add(c.hop(A, c.ax(waitA), 0.5, fh * 0.3), 2.3)
      .add(c.hop(C, c.cxo(waitC), 0.5, fh * 0.3), 2.4);
    [2.8, 2.9].forEach((t) => c.cue(t, 'hop'));

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
        c.cue(at + 0.55 + k * 0.12, 'tok');                          // the dish lands on the table
        c.cue(eat + 0.2, 'munch');
        c.cue(eat + 0.3, 'boing');                                   // and the tiger grows a little
      }
      say(c, 'Mmm!', at + 0.95 + (n - 1) * 0.28, headTop(c, tcx).x, c.m.t.top - fh * 0.2, 0.3, 'say say--ink say--small', 'tiger');
    };
    round(A, FOOD.sushi, 2.95);
    round(C, FOOD.pizza, 4.1);
    round(A, FOOD.sushi, 5.2, 2);
    round(C, FOOD.pizza, 6.5, 2);

    // full: a happy roar (well… a burp)
    const ROAR = 8.6;
    say(c, '*burp*', ROAR - 0.05, headTop(c, tcx).x, c.m.t.top - fh * 0.3, 0.5);
    c.cue(ROAR - 0.35, 'burp');
    const afterRoar = c.roarAt(ROAR, tcx, { base: size });
    // the two high-five
    const mid = (waitA + waitC) / 2;
    tl.add(c.hop(A, c.ax(mid - c.m.a.w * 0.45), 0.3, fh * 0.3), afterRoar)
      .add(c.hop(C, c.cxo(mid + c.m.c.w * 0.45), 0.3, fh * 0.3), afterRoar);
    say(c, 'High five!', afterRoar + 0.25, mid, c.m.a.top - fh * 0.25, 0.4, 'say', 'both');
    c.cue(afterRoar + 0.3, 'clap');
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
    c.cue(0.1, 'pop');
    [1.2, 3.0, 4.6].forEach((t) => c.cue(t, 'page'));             // the cover opens, then two pages turn

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
    // out of the book: Aiko, Capiche, then the tiger
    [2.0, 3.6].forEach((t) => { c.cue(t, 'boing'); c.cue(t + 0.65, 'hop'); });
    c.cue(5.2, 'whoosh', true);
    c.cue(5.85, 'thud');
    const afterRoar = c.roarAt(6.3, cx);

    // the two hold the tiger between them, like bookends
    const pressA = c.ax(cx - tw / 2 - c.m.a.w * 0.3);
    const pressC = c.cxo(cx + tw / 2 + c.m.c.w * 0.3);
    tl.add(c.hop(A, pressA, 0.4, fh * 0.35), afterRoar)
      .add(c.hop(C, pressC, 0.4, fh * 0.35), afterRoar)
      .to(A.body, { rotation: 13, duration: 0.25, ease: 'back.out(2)' }, afterRoar + 0.4)
      .to(C.body, { rotation: -13, duration: 0.25, ease: 'back.out(2)' }, afterRoar + 0.4)
      .to(T.body, { scaleX: 0.93, duration: 0.15, yoyo: true, repeat: 1 }, afterRoar + 0.5);
    say(c, 'Bookends!', afterRoar + 0.55, cx, c.m.t.top - fh * 0.32, 0.75, 'say', 'both');
    c.cue(afterRoar + 0.4, 'hop');

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
    c.cue(IN, 'whoosh');                                           // back into the book…
    c.cue(SHUT + 0.38, 'slam');                                    // …and it shuts
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
    c.steps(J, 6, 0.3, 0.2);
    [J + 0.55, J + 0.6].forEach((t) => c.cue(t, 'hop'));
    say(c, 'Judge Beshak!', ARRIVE, headTop(c, cx).x, c.m.t.top - fh * 0.15, 0.6, 'say', 'tiger');

    // taste one, think… taste the other, think…
    const mouth = c.mouthAt(cx);
    const taste = (dish, from, at, tilt) => {
      arc(c, dish, from, { x: mouth.x, y: mouth.y + th * 0.04 }, at, 0.55, th * 0.5, 0);
      tl.to(dish, { autoAlpha: 0, scale: 0.4, duration: 0.06 }, at + 0.55);
      c.chomp(at + 0.5, 2);
      [at + 0.5, at + 0.72].forEach((t) => c.cue(t, 'munch'));
      tl.to(head, { keyframes: { rotation: [tilt, tilt, 0] }, duration: 0.9, ease: 'sine.inOut' }, at + 1.0)
        .to(ear, { rotation: 8, duration: 0.07, yoyo: true, repeat: 3 }, at + 1.1);
      say(c, 'Hmm…', at + 1.0, headTop(c, cx).x, c.m.t.top - fh * 0.15, 0.5, 'say say--ink', 'tiger');
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
      c.cue(V + i * 0.35 + 0.5, 'ding');                             // a 10!
    });
    say(c, 'A tie!', V + 0.95, cx, c.m.t.top - fh * 0.35, 0.6, 'say', 'tiger');
    c.cue(V + 1.0, 'whoosh');
    c.cue(V + 1.05, 'sparkle');
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

  /* --- no-roar concepts: the tiger makes peace without a roar ---------------- */

  // the tiger walks in from off the left edge to `tcx`; returns when it stops
  // (`level`: how loud its footsteps are; tiptoeing is quieter)
  function strollIn(c, at, tcx, steps, stepDur, level = 0.14) {
    const { tl, gsap, T, th } = c;
    gsap.set(T.lift, { y: 0, autoAlpha: 1 });
    gsap.set(T.shadow, { scale: 1, opacity: 1 });
    tl.add(c.walk(T, c.tx(tcx), steps, stepDur, th * 0.035), at)
      .add(c.gait(steps, stepDur), at);
    c.steps(at, steps, stepDur, level);
    return at + steps * stepDur;
  }


  // a wink with the near eye
  function wink(c, at) {
    c.eyes(at, 'shut', 'right');
    c.eyes(at + 0.3, 'open', 'right');
    c.tl.to(c.head, { rotation: 4, duration: 0.15, yoyo: true, repeat: 1 }, at);
  }

  // the shared ending: both hop on, Caiko rides out of the poof, India's mandala
  // blooms from the saddle (where the roar used to do it), and off they go
  function rideOff(c, at, tcx) {
    const ride = c.mount(at, tcx);
    c.bloomAt(ride - 1, c.saddleAt(tcx));
    c.exitRight(ride, tcx);
  }

  /* --- 13 · holi ------------------------------------------------------------- */

  const HOLI = ['#E83E8C', '#F6C453', '#2FA36B', '#3D7DD8'];
  const HOLI_SOFT = ['#F6B9D3', '#FBE3A2', '#A9DDBF', '#B7CEF2'];   // the cloud, once coloured

  // a puff of coloured powder that blooms and drifts off
  function powder(c, colour, at, x, y, size, linger = 0.5) {
    c.cue(at, 'puff');
    const p = c.prop('powder', '', size);
    p.style.setProperty('--c', colour);
    c.tl.fromTo(p, { x, y, autoAlpha: 0.95, scale: 0.2 }, { scale: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, at)
      .to(p, { autoAlpha: 0, scale: 1.3, y: y - size * 0.2, duration: 0.7, ease: 'power1.in' }, at + 0.35 + linger);
  }

  // a handful of colour thrown from one point to another, landing in a puff
  function fling(c, colour, from, to, at, height, size) {
    const pinch = c.prop('powder powder--pinch', '', c.fh * 0.16);
    pinch.style.setProperty('--c', colour);
    c.tl.set(pinch, { autoAlpha: 1, scale: 1 }, at);
    arc(c, pinch, from, to, at, 0.4, height, 0);
    c.tl.set(pinch, { autoAlpha: 0 }, at + 0.4);
    powder(c, colour, at + 0.4, to.x, to.y, size, 0.4);
    return at + 0.4;
  }

  // smudges of colour that stay on a character: [x, y, colour, size] as fractions of its art
  const SPLAT = (colour) => `<svg viewBox="0 0 40 40"><path fill="${colour}" d="M20 3c4 0 5 5 9 4s6 3 5 7 4 7 1 10-1 8-5 8-5 5-9 4-6-4-10-3-6-4-4-8-5-6-2-10 2-7 6-8 5-8 9-8z"/></svg>`;
  function splats(c, ch, spots) {
    const { w, h } = ch === c.A ? c.m.a : c.m.c;
    return spots.map(([fx, fy, colour, size]) => {
      const s = c.held(ch, 'splat', SPLAT(colour), { width: w * size, left: w * (fx - size / 2), top: h * fy - (w * size) / 2 });
      c.gsap.set(s, { autoAlpha: 0 });
      return s;
    });
  }

  function holi(c) {
    const { tl, A, C, T, fh, cx, tw, th, head, tail, cloud, cloudY, cw, ch, cloudFill } = c;
    enter(c);
    faceoff(c, 1.25);
    const clash = charge(c, 2.2);

    // the tiger strolls up with a thali of colours on its back
    const tcx = c.landCx;
    const thW = tw * 0.36;
    const thH = thW * (44 / 120);
    const thLeft = tw * 0.42 - thW / 2;
    const thTop = th * 0.18 - thH * 0.85;
    const thali = c.held(T, 'thali', ART.thali, { width: thW, left: thLeft, top: thTop });
    const ARRIVE = strollIn(c, 2.0, tcx, 5, 0.36);
    wink(c, ARRIVE + 0.1);

    // four flicks of the head: four colours land on the brawl, and the cloud takes them on
    const mounds = [25, 46, 68, 90].map((u) => ({ x: tcx - tw / 2 + thLeft + thW * (u / 120), y: c.m.t.top + thTop + thH * 0.45 }));
    const targets = [[-0.24, -0.18], [0.16, -0.3], [-0.04, 0.12], [0.28, 0.02]].map(([dx, dy]) => ({ x: cx + cw * dx, y: cloudY + ch * dy }));
    HOLI.forEach((colour, i) => {
      const at = ARRIVE + 0.55 + i * 0.22;
      tl.to(head, { keyframes: { rotation: [-7, 2] }, duration: 0.2, ease: 'power2.out' }, at - 0.05);
      const land = fling(c, colour, mounds[i], targets[i], at, th * 0.45, cw * 0.5);
      tl.to(cloudFill.filter((_, k) => k % 4 === i), { backgroundColor: HOLI_SOFT[i], duration: 0.25 }, land);
    });
    tl.to(head, { rotation: 0, duration: 0.25 }, ARRIVE + 1.4)
      .to(tail, { keyframes: { rotation: [-14, 14, -10, 10, 0] }, duration: 1.2, ease: 'sine.inOut' }, ARRIVE + 0.5);

    // the brawl bursts in a blast of colour; out tumble two very colourful fighters
    const POP = ARRIVE + 1.75;
    c.brawl(clash, POP, [3.4, ARRIVE + 1.1]);
    tl.to(cloud, { scale: 1.5, autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, POP)
      .add(c.shake(10, 0.3), POP);
    HOLI.forEach((colour, i) => {
      const a = (i / 4) * Math.PI * 2 + 0.5;
      powder(c, colour, POP + i * 0.04, cx + Math.cos(a) * cw * 0.3, cloudY + Math.sin(a) * ch * 0.25, cw * 0.75, 0.45);
    });
    for (let k = 0; k < 10; k++) {
      const fleck = c.prop('powder powder--pinch', '', fh * 0.09);
      fleck.style.setProperty('--c', HOLI[k % 4]);
      const a = -Math.PI * (0.08 + 0.84 * (k / 9));
      tl.fromTo(fleck, { x: cx, y: cloudY, autoAlpha: 1, scale: 0.4 },
        { x: cx + Math.cos(a) * cw * 0.85, y: cloudY + Math.sin(a) * ch * 0.85, scale: 1, duration: 0.55, ease: 'power2.out', immediateRender: false }, POP)
        .to(fleck, { autoAlpha: 0, duration: 0.2 }, POP + 0.45);
    }
    // they land clear of the tiger
    const shift = Math.max(0, tcx + tw / 2 + c.m.a.w / 2 + 6 - aX(c, c.aFace));
    const aTo = c.aFace + shift;
    const cTo = c.cFace + shift;
    const colourA = splats(c, A, [[0.5, 0.17, HOLI[0], 0.42], [0.28, 0.62, HOLI[1], 0.34], [0.74, 0.84, HOLI[3], 0.3]]);
    const colourC = splats(c, C, [[0.4, 0.28, HOLI[1], 0.32], [0.64, 0.6, HOLI[2], 0.3], [0.3, 0.78, HOLI[3], 0.28]]);
    tl.add(c.hop(A, aTo, 0.45, fh * 0.3), POP)
      .add(c.hop(C, cTo, 0.45, fh * 0.3), POP)
      .to(A.body, { rotation: -360, duration: 0.45 }, POP)
      .to(C.body, { rotation: 360, duration: 0.45 }, POP)
      .set([A.body, C.body], { rotation: 0 }, POP + 0.46)
      .fromTo([...colourA, ...colourC], { autoAlpha: 0, scale: 0 },
        { autoAlpha: 0.95, scale: 1, duration: 0.2, ease: 'back.out(3)', stagger: 0.03, immediateRender: false }, POP + 0.05)
      .add(c.squash(A, 0.15), POP + 0.45)
      .add(c.squash(C, 0.15), POP + 0.45);
    const mid = (aX(c, aTo) + cX(c, cTo)) / 2;
    say(c, '?!', POP + 0.55, mid, c.m.a.top - fh * 0.15, 0.3, 'say say--ink', 'both');
    c.cue(POP, 'poof');
    [POP + 0.45, POP + 0.45].forEach((t) => c.cue(t, 'hop'));

    // "Happy Holi!" — and they throw colour at each other, laughing
    const HH = POP + 0.9;
    say(c, 'Happy Holi!', HH, headTop(c, tcx).x, c.m.t.top - fh * 0.2, 0.6, 'say', 'tiger');
    tl.to(tail, { keyframes: { rotation: [-14, 14, 0] }, duration: 0.5 }, HH);
    const THROW = HH + 0.6;
    const atA = { x: aX(c, aTo), y: c.m.a.top + c.m.a.h * 0.35 };
    const atC = { x: cX(c, cTo), y: c.m.c.top + c.m.c.h * 0.4 };
    tl.add(c.hopInPlace(A, fh * 0.15, 0.25), THROW - 0.1)
      .add(c.hopInPlace(C, fh * 0.15, 0.25), THROW + 0.2);
    fling(c, HOLI[0], aHand(c, aTo), atC, THROW, fh * 0.35, fh * 0.7);
    fling(c, HOLI[2], cHand(c, cTo), atA, THROW + 0.3, fh * 0.35, fh * 0.7);
    say(c, 'Ha ha!', THROW + 0.8, mid, c.m.a.top - fh * 0.2, 0.4, 'say', 'both');
    c.cue(THROW + 0.9, 'sparkle');
    tl.add(c.heartsUp(mid, c.m.a.top, fh * 0.8), THROW + 0.9);

    const RIDE = THROW + 1.4;
    tl.set(thali, { autoAlpha: 0 }, RIDE + 0.5);      // hidden by the (still colourful) poof
    rideOff(c, RIDE, tcx);
    return { own: true };
  }

  /* --- 14 · say paneer! ------------------------------------------------------ */

  function photo(c) {
    const { tl, gsap, A, C, fh, cx, W, H, tw, th, floorY, ear } = c;
    // the fight happens a little right of centre, so the tiger has room on the left
    const tcx = c.landCx;
    const s = Math.max(0, tcx + tw / 2 + W * 0.04 + c.windup * 2 - (aX(c, c.aFace) - c.m.a.w / 2));
    const f = { ...c, aFace: c.aFace + s, aHit: c.aHit + s, cFace: c.cFace + s, cHit: c.cHit + s };
    gsap.set([c.sushiHit, c.pizzaHit], { x: `+=${s}` });
    enter(c, f.aFace, f.cFace);
    trade(f, 1.4, 2.5);

    // the tiger wanders in while they wind up for round three
    const ARRIVE = strollIn(c, 1.8, tcx, 5, 0.36);
    const WIND = ARRIVE + 0.05;
    tl.to(A.root, { x: f.aFace - c.windup * 2, duration: 0.25, ease: 'power2.out' }, WIND)
      .to(C.root, { x: f.cFace + c.windup * 2, duration: 0.25, ease: 'power2.out' }, WIND)
      .to(A.body, { rotation: -16, duration: 0.25 }, WIND)
      .to(C.body, { rotation: 16, duration: 0.25 }, WIND);

    // "Smile!" They freeze… and scramble into a pose, side by side
    const ht = headTop(c, tcx);
    const SMILE = WIND + 0.3;
    say(c, 'Smile!', SMILE, ht.x, ht.y - fh * 0.15, 0.5, 'say say--ink', 'tiger');
    c.chomp(SMILE);
    tl.to([A.body, C.body], { scaleY: 1.1, scaleX: 0.92, duration: 0.1 }, SMILE + 0.05)
      .to([A.body, C.body], { scaleY: 1, scaleX: 1, rotation: 0, duration: 0.2 }, SMILE + 0.4);

    // the camera stands at the tiger's chest, so its face stays in view
    const camH = th * 0.52;
    const camW = camH * (80 / 130);
    const cam = { x: tcx - tw / 2 + tw * 0.96, y: floorY - camH / 2 };
    const poseMid = Math.max(cx + W * 0.08, cam.x + camW / 2 + (c.m.a.w + c.m.c.w) / 2 + W * 0.03);
    const aPose = c.ax(poseMid - c.m.a.w * 0.42);
    const cPose = c.cxo(poseMid + c.m.c.w * 0.42);
    const POSE = SMILE + 0.45;
    tl.add(c.hop(A, aPose, 0.4, fh * 0.3), POSE)
      .add(c.hop(C, cPose, 0.4, fh * 0.3), POSE + 0.05)
      .to(A.body, { rotation: 10, duration: 0.2, ease: 'back.out(2)' }, POSE + 0.45)
      .to(C.body, { rotation: -10, duration: 0.2, ease: 'back.out(2)' }, POSE + 0.5);

    // up comes the camera
    const camera = c.prop('dish', ART.camera, camW);
    gsap.set(camera, { transformOrigin: '50% 100%' });
    tl.fromTo(camera, { x: cam.x, y: cam.y, autoAlpha: 1, scaleY: 0 },
      { scaleY: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, POSE + 0.15);
    say(c, 'Say paneer!', POSE + 0.55, ht.x, ht.y - fh * 0.15, 0.55, 'say say--ink', 'tiger');
    c.cue(POSE + 0.15, 'rise');                                    // up comes the camera
    [POSE + 0.4, POSE + 0.45].forEach((t) => c.cue(t, 'hop'));
    tl.to(ear, { rotation: 8, duration: 0.07, yoyo: true, repeat: 3 }, POSE + 0.6);
    say(c, 'PANEER!', POSE + 1.1, poseMid, c.m.a.top - fh * 0.2, 0.3, 'say', 'both');
    tl.add(c.hopInPlace(A, fh * 0.1, 0.22), POSE + 1.1)
      .add(c.hopInPlace(C, fh * 0.1, 0.22), POSE + 1.1);

    // FLASH
    const FLASH = POSE + 1.45;
    const bulb = { x: cam.x - camW / 2 + camW * 0.2, y: cam.y - camH / 2 + camH * 0.105 };
    const star = c.prop('dish', ART.flashStar, camW * 0.9);
    const flash = c.prop('flash', '', W);
    flash.style.height = `${H}px`;
    tl.fromTo(star, { x: bulb.x, y: bulb.y, autoAlpha: 1, scale: 0, rotation: -20 },
      { scale: 1, rotation: 0, duration: 0.12, ease: 'power2.out', immediateRender: false }, FLASH)
      .to(star, { autoAlpha: 0, scale: 1.3, duration: 0.2 }, FLASH + 0.2)
      .fromTo(flash, { x: W / 2, y: H / 2, autoAlpha: 0.95 }, { autoAlpha: 0, duration: 0.6, ease: 'power2.in', immediateRender: false }, FLASH + 0.04)
      .add(c.shake(5, 0.2), FLASH)
      .to([A.body, C.body], { scaleY: 0.88, scaleX: 1.08, duration: 0.08, yoyo: true, repeat: 1 }, FLASH + 0.05);
    c.eyes(FLASH, 'shut');
    c.eyes(FLASH + 0.3, 'open');

    // out slides the photo, and it develops… into the two of them as one
    const picW = fh * 0.6;
    const pic = c.prop('polaroid', '<span class="polaroid__frame"><span class="polaroid__pic"><img src="assets/caiko.png" alt=""></span></span>', picW);
    const slot = { x: cam.x - camW * 0.2, y: cam.y - camH * 0.38 };
    const hang = { x: poseMid, y: c.m.a.top - fh * 0.55 };
    const OUT = FLASH + 0.4;
    c.cue(FLASH, 'shutter');
    c.cue(OUT, 'whirr');                                           // out comes the photo
    tl.fromTo(pic, { autoAlpha: 1, scale: 0.3, rotation: -10 }, { scale: 1, rotation: 6, duration: 0.6, ease: 'power2.out', immediateRender: false }, OUT)
      .to(pic, { keyframes: { rotation: [-4, 3, -1, 0] }, duration: 0.9, ease: 'sine.inOut' }, OUT + 0.6)
      .to(pic.querySelector('.polaroid__pic'), { backgroundColor: '#FBF6EC', duration: 1 }, OUT + 0.6)
      .to(pic.querySelector('img'), { opacity: 1, duration: 1 }, OUT + 0.7);
    arc(c, pic, slot, hang, OUT, 0.6, fh * 0.12, 0);

    // aww
    const AWW = OUT + 1.3;
    tl.to([A.body, C.body], { rotation: 0, duration: 0.2 }, AWW)
      .add(c.hopInPlace(A, fh * 0.25, 0.35), AWW)
      .add(c.hopInPlace(C, fh * 0.25, 0.35), AWW + 0.05)
      .add(c.heartsUp(poseMid, c.m.a.top + fh * 0.2, fh * 0.6), AWW + 0.2);

    // the photo and the camera tidy away; on they hop
    c.cue(AWW + 0.2, 'sparkle');
    const RIDE = AWW + 0.9;
    c.cue(RIDE - 0.2, 'whoosh');
    tl.to(pic, { y: `-=${fh * 0.3}`, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, RIDE - 0.2)
      .to(camera, { scaleY: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, RIDE - 0.2);
    rideOff(c, RIDE, tcx);
    return { own: true };
  }

  /* --- 15 · the tickle ------------------------------------------------------- */

  function tickle(c) {
    const { tl, A, C, T, fh, cx, W, tw, th, tail, cloud, cloudY, cw, ch, floorY } = c;
    enter(c);
    const clash = charge(c, 1.3);

    // the tiger tiptoes up to the brawl…
    const tcx = Math.max(tw / 2 + 12, cx - cw / 2 - tw * 0.42);
    const TIP = 1.8;
    const ARRIVE = strollIn(c, TIP, tcx, 6, 0.36, 0.06);           // on tiptoe: barely a sound
    tl.to(T.body, { scaleY: 1.06, scaleX: 0.97, duration: 0.25 }, TIP)
      .to(T.body, { scaleY: 1, scaleX: 1, duration: 0.2 }, ARRIVE - 0.25);
    say(c, 'tip… tip… tip…', TIP + 0.9, tcx, c.m.t.top - fh * 0.12, 0.8, 'say say--ink say--small');

    // …turns its back on it, winks at us…
    const TURN = ARRIVE + 0.1;
    tl.to(T.body, { scaleX: -1, duration: 0.3, ease: 'power2.inOut' }, TURN);
    wink(c, TURN + 0.4);

    // …and tickles it with its tail. The fight turns into giggles
    const TICKLE = TURN + 0.6;
    const tailTip = { x: tcx + tw / 2 - tw * 0.04, y: c.m.t.top + th * 0.7 };
    tl.to(tail, { keyframes: { rotation: [24, -4, 26, -2, 24, -6, 22, 0] }, duration: 1.3, ease: 'sine.inOut' }, TICKLE);
    say(c, 'tickle tickle', TICKLE + 0.1, tailTip.x, tailTip.y + th * 0.45, 0.6, 'say say--ink say--small');
    [['hee!', 0.35, -0.32, -0.45], ['ha ha!', 0.65, 0.22, -0.55], ['hihi!', 0.95, -0.12, -0.68], ['hahaha!', 1.2, 0.3, -0.4]]
      .forEach(([text, dt, dx, dy], i) => say(c, text, TICKLE + dt, cx + cw * dx, cloudY + ch * dy, 0.3, 'say say--small', i % 2 ? 'capiche' : 'aiko'));
    [TURN, TICKLE, TICKLE + 0.45, TICKLE + 0.9].forEach((t) => c.cue(t, 'whoosh'));   // the turn, the tail swishing
    const POP = TICKLE + 1.4;
    // a scuffle until the tickling starts; after that it's all giggles
    c.brawl(clash, POP, [TICKLE + 0.2, TICKLE + 0.5, TICKLE + 0.8], false);
    c.cue(clash + 0.05, 'scuffle', TICKLE - clash - 0.1);
    c.cue(POP, 'poof');
    c.cue(POP + 0.5, 'hop');

    // the cloud bursts; out they tumble, still giggling
    tl.to(cloud, { scale: 1.4, autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, POP)
      .add(c.dustPuff(cx, floorY, cw * 0.6), POP);
    const aOut = c.ax(Math.max(cx + W * 0.04, tcx + tw / 2 + c.m.a.w / 2 + 8));
    const cOut = c.cxo(aX(c, aOut) + (c.m.a.w + c.m.c.w) / 2 + W * 0.04);
    tl.add(c.hop(A, aOut, 0.5, fh * 0.35), POP)
      .add(c.hop(C, cOut, 0.5, fh * 0.35), POP + 0.05)
      .to([A.body, C.body], { rotation: 360, duration: 0.5 }, POP)
      .set([A.body, C.body], { rotation: 0 }, POP + 0.56);
    const LOL = POP + 0.6;
    const mid = (aX(c, aOut) + cX(c, cOut)) / 2;
    tl.to([A.body, C.body], { keyframes: { rotation: [-22, 18, -22, 18, -12, 0] }, duration: 1.1, ease: 'sine.inOut' }, LOL);
    for (let i = 0; i < 4; i++) {
      tl.add(c.hopInPlace(A, fh * 0.08, 0.2), LOL + i * 0.25)
        .add(c.hopInPlace(C, fh * 0.08, 0.2), LOL + 0.1 + i * 0.25);
    }
    say(c, 'HA HA HA!', LOL + 0.1, mid, c.m.a.top - fh * 0.2, 0.6, 'say', 'both');

    // the tiger turns back round: "Friends?" They look at each other…
    const BACK = LOL + 0.5;
    tl.to(T.body, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, BACK);
    say(c, 'Friends?', BACK + 0.35, headTop(c, tcx).x, c.m.t.top - fh * 0.15, 0.5, 'say say--ink', 'tiger');
    c.cue(BACK, 'whoosh');
    const MAKEUP = BACK + 0.85;
    tl.to(A.body, { rotation: 10, duration: 0.25 }, MAKEUP)
      .to(C.body, { rotation: -10, duration: 0.25 }, MAKEUP)
      .add(c.heartsUp(mid, c.m.a.top, fh * 0.8), MAKEUP + 0.15)
      .to([A.body, C.body], { rotation: 0, duration: 0.25 }, MAKEUP + 0.7);
    c.cue(MAKEUP + 0.15, 'sparkle');

    rideOff(c, MAKEUP + 0.9, tcx);
    // the brawl's flying symbols turn to giggles once the tickling starts
    return { own: true, bits: ['★', '!@#$', '✦', '%&!', '✶', '?!', '★', '#@!', '✦', '!!', 'ha!', 'hee', 'ha ha', 'hihi'] };
  }

  /* --- 16 · navratri: dandiya to a dhol beat, and a garba twirl ---------------- */

  // Navratri's colours, for the garba twirl
  const NAVRATRI = ['#E3242B', '#F08A1C', '#F6C453', '#2FA36B', '#0F7C8C', '#1F4FBF', '#6B3FA0', '#E83E8C', '#C2185B'];

  // a toran of marigolds and mango leaves, hung in three swags
  function toranArt() {
    const pts = [];
    for (let s = 0; s < 3; s++) {
      const x0 = s * 200;
      for (let k = 0; k < 8 || (s === 2 && k === 8); k++) {
        const t = k / 8;
        pts.push([(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + 100) + t * t * (x0 + 200),
          (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 74 + t * t * 6]);
      }
    }
    const f = (n) => n.toFixed(1);
    const leaves = pts.filter((_, i) => i % 2).map(([x, y]) => `<path d="M${f(x)} ${f(y + 4)}c-6 9-6 20 0 30c6-10 6-21 0-30z" fill="#3E9E5A"/>`).join('');
    const flowers = pts.map(([x, y], i) => `<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="${i % 2 ? '#F6C453' : '#F08A1C'}"/>`
      + `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="#C8553D" stroke="none"/>`).join('');
    return `<svg viewBox="-10 -6 620 80" stroke="#111" stroke-width="2">
      <path d="M0 6Q100 74 200 6Q300 74 400 6Q500 74 600 6" fill="none" stroke-width="2.4"/>${leaves}${flowers}</svg>`;
  }

  // one dandiya stick, striped in two colours with a bead at its tip; `dir` 1 leans up-right,
  // -1 up-left. Its handle (the bottom end) is at (0.21, 0.83) or (0.79, 0.83) of the box.
  function stickArt(dir, c1, c2) {
    const d = dir > 0 ? 'M10 40L40 10' : 'M38 40L8 10';
    const tip = dir > 0 ? '40' : '8';
    return `<svg viewBox="0 0 48 48" fill="none" stroke-linecap="round">
      <path d="${d}" stroke="#111" stroke-width="7"/><path d="${d}" stroke="${c1}" stroke-width="4"/>
      <path d="${d}" stroke="${c2}" stroke-width="4" stroke-dasharray="4 5"/>
      <circle cx="${tip}" cy="10" r="3.6" fill="${c2}" stroke="#111" stroke-width="2"/></svg>`;
  }

  // a ring of Navratri's colours, like a twirling ghagra seen from above
  function whirlArt() {
    const p = (a, r) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
    const rad = (deg) => (deg * Math.PI) / 180;
    const parts = NAVRATRI.map((col, i) => {
      const a0 = rad(i * 40 + 4);
      const a1 = rad(i * 40 + 36);
      return `<path d="M${p(a0, 46)}A46 46 0 0 1 ${p(a1, 46)}" stroke="${col}"/>`
        + `<circle cx="${p((a0 + a1) / 2, 31).split(' ')[0]}" cy="${p((a0 + a1) / 2, 31).split(' ')[1]}" r="4.5" fill="${NAVRATRI[(i + 4) % 9]}" stroke="none"/>`;
    }).join('');
    return `<svg viewBox="-60 -60 120 120" fill="none" stroke-width="11" stroke-linecap="round">${parts}</svg>`;
  }

  function navratri(c) {
    const { tl, gsap, A, C, T, fh, cx, W, tw, th, head, ear, tail, floorY, bg, korean, italian } = c;
    // the garba circle is a little right of centre, leaving room for the tiger on the left
    const pc = cx + W * 0.1;
    const potW = fh * 0.48;
    const potH = potW * (112 / 80);
    const potTop = floorY - potH;
    const flame = { x: pc, y: potTop + potH * 0.1 };
    const aSt = c.ax(pc - potW * 0.5 - c.m.a.w * 0.55 - W * 0.02);
    const cSt = c.cxo(pc + potW * 0.5 + c.m.c.w * 0.55 + W * 0.02);
    const tcx = Math.max(tw / 2 + 12, aX(c, aSt) - c.m.a.w / 2 - tw / 2 - W * 0.02);
    const ht = headTop(c, tcx);
    const beat = (at) => tl.to([...korean, ...italian], { y: -7, duration: 0.08, yoyo: true, repeat: 1 }, at);

    // the setting: a toran drops in across the top; the garbo appears and its lamp lights up
    const toranW = Math.min(W * 0.86, 900);
    const toranY = Math.max(64, Math.min(c.m.a.top, c.m.t.top) - fh * 0.8);
    const toran = c.prop('dish', toranArt(), toranW, bg);
    tl.fromTo(toran, { x: cx, y: toranY - fh * 0.6, autoAlpha: 1 }, { y: toranY, duration: 0.7, ease: 'bounce.out', immediateRender: false }, 0.1);
    // (the lamp and its glow stand behind the dancers, so their sticks cross in front of it)
    const glow = c.prop('powder', '', potW * 1.9, bg);
    glow.style.setProperty('--c', 'rgba(255, 205, 80, .6)');
    const pot = c.prop('dish', ART.garbo, potW, bg);
    const lamp = pot.querySelector('.garbo__flame');
    gsap.set(pot, { transformOrigin: '50% 100%' });
    gsap.set(lamp, { transformOrigin: '50% 100%' });
    pop(c, pot, 0.25, pc, floorY - potH / 2);
    tl.fromTo(glow, { x: pc, y: flame.y + potH * 0.35, autoAlpha: 0, scale: 0.4 },
      { autoAlpha: 0.9, scale: 1, duration: 0.5, immediateRender: false }, 0.6)
      .to(glow, { scale: 1.15, autoAlpha: 0.65, duration: 0.45, yoyo: true, repeat: 17, ease: 'sine.inOut' }, 1.1)
      .fromTo(lamp, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, 0.6)
      .to(lamp, { scaleY: 1.25, scaleX: 0.85, duration: 0.17, yoyo: true, repeat: 49, ease: 'sine.inOut' }, 0.9);
    c.cue(0.1, 'whoosh');
    c.cue(0.6, 'sparkle');                                         // the lamp lights

    // they hop in, each with a pair of dandiya sticks
    enter(c, aSt, cSt);
    // a stick in each hand, all four different: Aiko's hands are the ends of its arms; Capiche
    // grips one at its fingers (left) and one in the curl of its C (right)
    const stickW = fh * 0.5;
    const { w: aw, h: ah } = c.m.a;
    const { w: cw2, h: ch2 } = c.m.c;
    const stick = (ch, x, y, dir, c1, c2) => {
      const el = c.held(ch, 'dandiya', stickArt(dir, c1, c2), {
        width: stickW, left: x - stickW * (dir > 0 ? 0.21 : 0.79), top: y - stickW * 0.83,
      });
      gsap.set(el, { transformOrigin: dir > 0 ? '21% 83%' : '79% 83%' });   // it swings from the hand
      return el;
    };
    const sticksA = [stick(A, aw * 0.03, ah * 0.64, -1, '#2FA36B', '#E83E8C'), stick(A, aw * 0.97, ah * 0.64, 1, '#C8553D', '#F6C453')];
    const sticksC = [stick(C, cw2 * 0.06, ch2 * 0.55, -1, '#1F4FBF', '#F6C453'), stick(C, cw2 * 0.95, ch2 * 0.72, 1, '#6B3FA0', '#F08A1C')];
    const sticks = [...sticksA, ...sticksC];
    say(c, 'Dandiya!', 1.25, pc, c.m.a.top - fh * 0.35, 0.4, 'say', 'both');

    // cross dandiya: they lean in over the garbo and strike sticks in an X on the beat. 'R' is Aiko's
    // right stick on Capiche's left; for 'L' both turn round, so it's Aiko's left on Capiche's right.
    // Faster and harder as it goes.
    // they stop a stick's length apart, hands either side of the garbo, so the sticks cross above it
    const meetA = c.ax(pc - stickW * 0.57 - aw * 0.47);
    const meetC = c.cxo(pc + stickW * 0.57 + cw2 * 0.44);
    const clackY = c.m.a.top + ah * 0.64 - stickW * 0.33;           // where the inner sticks cross
    let turned = false;
    const clack = (at, hard, side = 'R') => {
      const back = hard ? 0.08 : 0.14;
      if ((side === 'L') !== turned) {                             // turn round to strike with the other stick
        turned = !turned;
        tl.to([A.body, C.body], { scaleX: turned ? -1 : 1, duration: hard ? 0.07 : 0.14, ease: 'power1.inOut' }, at - (hard ? 0.17 : 0.3));
        c.cue(at - (hard ? 0.17 : 0.3), 'whoosh');
      }
      // the inner stick of each swings from the hand towards the other, and they cross
      const inner = turned ? [[sticksA[0], -1], [sticksC[1], 1]] : [[sticksA[1], 1], [sticksC[0], -1]];
      inner.forEach(([el, dir]) => {
        tl.to(el, { rotation: dir * 7, duration: 0.1, ease: 'power2.in' }, at - 0.1)
          .to(el, { rotation: 0, duration: back + 0.04, ease: 'power2.out' }, at + 0.02);
      });
      tl.to(A.root, { x: meetA, duration: 0.1, ease: 'power2.in' }, at - 0.1)
        .to(C.root, { x: meetC, duration: 0.1, ease: 'power2.in' }, at - 0.1)
        .to(A.body, { rotation: 4, duration: 0.1 }, at - 0.1)
        .to(C.body, { rotation: -4, duration: 0.1 }, at - 0.1)
        .to(A.root, { x: aSt, duration: back, ease: 'power2.out' }, at + 0.02)
        .to(C.root, { x: cSt, duration: back, ease: 'power2.out' }, at + 0.02)
        .to([A.body, C.body], { rotation: 0, duration: back }, at + 0.02);
      const spark = c.prop('dish', ART.flashStar, fh * (hard ? 0.3 : 0.18));
      tl.fromTo(spark, { x: pc, y: clackY, autoAlpha: 1, scale: 0, rotation: -20 },
        { scale: 1, rotation: 0, duration: 0.08, immediateRender: false }, at)
        .to(spark, { autoAlpha: 0, scale: 1.3, duration: 0.12 }, at + 0.1);
      if (hard) tl.add(c.shake(5, 0.12), at);
      beat(at);
      c.cue(at, 'clack', hard ? 1 : 0.7);
    };
    [[1.7, 'R'], [2.1, 'L'], [2.5, 'R']].forEach(([at, side]) => clack(at, false, side));
    [[2.85, 'L'], [3.1, 'R'], [3.3, 'L'], [3.5, 'R']].forEach(([at, side]) => clack(at, true, side));
    say(c, 'Faster!', 2.55, aX(c, aSt), c.m.a.top - fh * 0.15, 0.3, 'say say--small', 'aiko');
    say(c, 'Faster!!', 2.95, cX(c, cSt), c.m.c.top - fh * 0.15, 0.3, 'say say--small', 'capiche');

    // CRACK: one clack too hard, the sticks go flying, and now it's a fight
    const CRACK = 3.75;
    tl.to(A.root, { x: meetA, duration: 0.12, ease: 'power3.in' }, CRACK - 0.12)
      .to(C.root, { x: meetC, duration: 0.12, ease: 'power3.in' }, CRACK - 0.12)
      .to(A.root, { x: aSt - c.knock, duration: 0.3, ease: 'power3.out' }, CRACK)
      .to(C.root, { x: cSt + c.knock, duration: 0.3, ease: 'power3.out' }, CRACK)
      .to(A.body, { rotation: -18, duration: 0.2 }, CRACK)
      .to(C.body, { rotation: 18, duration: 0.2 }, CRACK)
      .set(sticks, { autoAlpha: 0 }, CRACK)
      .add(c.shake(11, 0.3), CRACK);
    const bigSpark = c.prop('dish', ART.flashStar, fh * 0.5);
    tl.fromTo(bigSpark, { x: pc, y: clackY, autoAlpha: 1, scale: 0, rotation: -30 },
      { scale: 1, rotation: 0, duration: 0.1, immediateRender: false }, CRACK)
      .to(bigSpark, { autoAlpha: 0, scale: 1.4, duration: 0.2 }, CRACK + 0.15);
    const handY = c.m.a.top + ah * 0.64;
    [
      [-1, { x: pc - stickW * 0.3, y: clackY }, '#C8553D', '#F6C453'],
      [1, { x: pc + stickW * 0.3, y: clackY }, '#1F4FBF', '#F6C453'],
      [-1, { x: aX(c, meetA) - aw * 0.47, y: handY - stickW * 0.3 }, '#2FA36B', '#E83E8C'],
      [1, { x: cX(c, meetC) + cw2 * 0.45, y: handY - stickW * 0.3 }, '#6B3FA0', '#F08A1C'],
    ].forEach(([dir, from, c1, c2], i) => {
      const fly = c.prop('dish', stickArt(dir, c1, c2), stickW);
      tl.set(fly, { autoAlpha: 1 }, CRACK);
      arc(c, fly, from, { x: pc + dir * W * (i < 2 ? 0.3 : 0.42), y: -stickW }, CRACK, 0.65 + i * 0.05, fh * 0.5, dir * 720);
      tl.set(fly, { autoAlpha: 0 }, CRACK + 0.75);
    });
    c.cue(CRACK, 'snap');
    say(c, '!@#$', CRACK + 0.35, pc, c.m.a.top - fh * 0.4, 0.4, 'say', 'both');
    tl.to([A.body, C.body], { rotation: (i) => (i ? 10 : -10), scaleY: 1.06, scaleX: 0.95, duration: 0.2 }, CRACK + 0.35);

    // a festival dhol starts up and the tiger strolls in to its beat (its tail swishing in time);
    // they stop and turn
    const STROLL = CRACK + 0.4;
    const ARRIVE = strollIn(c, STROLL, tcx, 5, 0.34, 0.1);
    // one beat for the rest of the dance: the dhol on every beat, from the tiger's entrance to the twirl
    const BEAT = 0.34;
    const BLESS = ARRIVE + 0.15;
    const WHIRL_AT = BLESS + 0.85 + 3 * BEAT + 0.55;
    const BEATS = [];
    for (let at = STROLL; at < WHIRL_AT - 0.1; at += BEAT) BEATS.push(at);
    BEATS.forEach((at, i) => {
      beat(at);
      c.cue(at, 'dhol', i % 2);
      if (at > ARRIVE) tl.to(tail, { keyframes: { rotation: [i % 2 ? -14 : 14, 0] }, duration: 0.3, ease: 'sine.inOut' }, at - 0.04);
    });
    tl.to([A.body, C.body], { rotation: 0, scaleY: 1.1, scaleX: 0.92, duration: 0.1 }, STROLL + 0.3)
      .to([A.body, C.body], { rotation: -8, scaleY: 1, scaleX: 1, duration: 0.3 }, STROLL + 0.8)
      .to(A.root, { x: aSt, duration: 0.3 }, STROLL + 0.8)
      .to(C.root, { x: cSt, duration: 0.3 }, STROLL + 0.8);

    // "Shubh Navratri!" New sticks appear for both, and everyone dances
    say(c, 'Shubh Navratri!', BLESS, ht.x, ht.y - fh * 0.15, 0.7, 'say', 'tiger');
    c.chomp(BLESS, 2);
    tl.to(ear, { rotation: 8, duration: 0.07, yoyo: true, repeat: 3 }, BLESS + 0.1)
      .to([A.body, C.body], { rotation: 0, duration: 0.2 }, BLESS + 0.4)
      .set(sticks, { autoAlpha: 1 }, BLESS + 0.5)
      .fromTo(sticks, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, BLESS + 0.5);
    c.cue(BLESS + 0.5, 'sparkle');
    // three clacks together, each landing between two dhol beats
    const DANCE = STROLL + (Math.ceil((BLESS + 0.85 - STROLL) / BEAT - 0.5) + 0.5) * BEAT;
    ['R', 'L', 'R'].forEach((side, k) => clack(DANCE + k * BEAT, false, side));
    tl.to(A.body, { rotation: 360, duration: 0.4, ease: 'power1.inOut' }, DANCE + 0.9)
      .to(C.body, { rotation: -360, duration: 0.4, ease: 'power1.inOut' }, DANCE + 0.9)
      .set([A.body, C.body], { rotation: 0 }, DANCE + 1.31)
      .add(c.hopInPlace(A, fh * 0.25, 0.4), DANCE + 0.9)
      .add(c.hopInPlace(C, fh * 0.25, 0.4), DANCE + 0.9)
      .add(c.heartsUp(pc, c.m.a.top, fh * 0.7), DANCE + 1.1)
      .to(head, { keyframes: { rotation: [4, -3, 0] }, duration: 0.6 }, DANCE + 0.9);
    c.cue(DANCE + 0.9, 'whoosh');
    c.cue(DANCE + 1.1, 'sparkle');

    // the garba twirl: they spin round the garbo in a whirl of Navratri's colours, into the lamp's glow…
    const WHIRL = WHIRL_AT;
    const whirl = c.prop('dish', whirlArt(), potW * 2.6);
    tl.fromTo(whirl, { x: pc, y: floorY - potH * 0.55, autoAlpha: 0, scale: 0.4, rotation: 0 },
      { autoAlpha: 0.95, scale: 1, rotation: 540, duration: 1.3, ease: 'power1.in', immediateRender: false }, WHIRL)
      .to(whirl, { scale: 0.15, rotation: 900, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, WHIRL + 1.3)
      // twirling on the spot (turning round and round), drawn in, shrinking and rising into the flame
      .to([A.body, C.body], { scaleX: -1, duration: 0.18, yoyo: true, repeat: 7, ease: 'sine.inOut' }, WHIRL)
      .to(A.root, { x: c.ax(pc), duration: 1.4, ease: 'power2.in' }, WHIRL + 0.1)
      .to(C.root, { x: c.cxo(pc), duration: 1.4, ease: 'power2.in' }, WHIRL + 0.1)
      .to([A.lift, C.lift], { scale: 0.12, y: flame.y - floorY + fh / 2, duration: 1.4, ease: 'power2.in' }, WHIRL + 0.1)
      .set([A.root, C.root], { autoAlpha: 0 }, WHIRL + 1.5);
    c.cue(WHIRL, 'whirl');

    // …a flash of lamplight, and out of the lamp rises Caiko…
    const FLASH = WHIRL + 1.5;
    tl.to(glow, { scale: 3, autoAlpha: 1, duration: 0.18, ease: 'power2.out' }, FLASH)
      .to(glow, { scale: 1.2, autoAlpha: 0.7, duration: 0.6, ease: 'power2.inOut' }, FLASH + 0.2)
      .to(lamp, { scaleY: 2.2, scaleX: 1.3, duration: 0.15, yoyo: true, repeat: 1 }, FLASH)
      .add(c.shake(6, 0.2), FLASH);
    const [seatX, seatY] = c.rider.dataset.seat.split(' ').map(Number);
    const saddle = c.saddleAt(tcx);
    const stand = { x: pc - (saddle.x + c.rw * (0.5 - seatX)), y: potTop - potH * 0.05 - (saddle.y + c.rh * (1 - seatY)) };
    tl.set(c.rider, { autoAlpha: 1, x: stand.x }, FLASH)
      .fromTo(c.rider, { y: stand.y + c.rh * 0.4, scale: 0.2 }, { y: stand.y, scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: false }, FLASH)
      .add(c.heartsUp(pc, potTop - c.rh, c.rh * 0.6), FLASH + 0.2);
    c.cue(FLASH, 'sparkle');
    c.cue(FLASH + 0.05, 'chime');

    // …who flips onto the tiger's back; India's mandala opens out of the lamp's flame
    const HOP = FLASH + 0.7;
    const hopDur = 0.6;
    const SEAT = HOP + hopDur;
    tl.set(c.rider, { transformOrigin: '50% 50%' }, HOP)
      .to(c.rider, { x: 0, duration: hopDur, ease: 'none' }, HOP)
      .to(c.rider, {
        keyframes: [
          { y: Math.min(stand.y, 0) - fh * 0.3, duration: hopDur / 2, ease: 'power2.out' },
          { y: 0, duration: hopDur / 2, ease: 'power2.in' },
        ],
      }, HOP)
      .to(c.rider, { rotation: -360, duration: hopDur, ease: 'power1.inOut' }, HOP)
      .set(c.rider, { rotation: 0, transformOrigin: '50% 100%' }, SEAT)
      .to(c.rider, { keyframes: [{ scaleY: 0.85, scaleX: 1.1, duration: 0.07 }, { scaleY: 1, scaleX: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }] }, SEAT)
      .add(c.squash(T, 0.1, 0.45), SEAT)
      .to([pot, glow], { autoAlpha: 0, scale: 0.7, duration: 0.4 }, SEAT + 0.3)
      .to(toran, { autoAlpha: 0, y: toranY - fh * 0.3, duration: 0.5 }, SEAT + 0.8);
    c.bloomAt(SEAT, flame);
    c.cue(HOP, 'whoosh');
    c.cue(SEAT, 'hop');

    // and off they go
    c.exitRight(SEAT + 0.45, tcx);
    return { own: true };
  }

  return { fight, cookoff, sharing, noodle, dance, race, sleeping, chef, host, guest, storybook, judge, holi, photo, tickle, navratri };
})();

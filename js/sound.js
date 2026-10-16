/* ==========================================================================
   Bookends Hospitality: sound for the intro only
   Sound is on by default: sitar-and-tabla music under the Navratri story
   (fading out at the title), the characters' voices, and effects on cue
   (intro.js calls BOOKENDS_SOUND.fx('dhol') etc. at each moment). The rest
   of the site is silent.

   Browsers only let a page make sound once the visitor has clicked, tapped
   or pressed a key. So the music tries to start with the intro; if the
   browser says no, it starts on the visitor's first click, tap or key press,
   and the sound button shows "Tap for sound" until then. Muting with the
   button is remembered for the next visit.

   Recordings: the music and the voice lines (credits in
   assets/audio/CREDITS.txt and the footer).
   Every other effect is generated here with Web Audio.
   ========================================================================== */
window.BOOKENDS_SOUND = (() => {
  'use strict';

  const MUSIC = 'assets/audio/sitar-tabla.m4a';
  // main plays the Navratri opening only, so only its five lines are downloaded (the
  // variation branch lists every concept's lines and samples). A line with no file
  // falls back to gibberish (FX.say).
  const SAMPLES = {};
  const LINES = [
    'aiko-dandiya', 'aiko-faster', 'capiche-dandiya', 'capiche-faster', 'tiger-shubh-navratri',
  ];
  LINES.forEach((id) => { SAMPLES[id] = `assets/audio/voices/${id}.m4a`; });
  const MUSIC_LEVEL = 0.14;   // the track is mastered loud: this sits it under the effects
  const FX_LEVEL = 0.9;
  const PREF_KEY = 'bookends-sound';   // 'off' once the visitor mutes

  const stage = document.getElementById('stage');
  const btn = document.getElementById('sound-toggle');

  let ctx = null;
  let out = null;           // master: compressor → speakers
  let musicGain = null;
  let fxGain = null;
  let noise = null;         // a white-noise buffer for whooshes, steam and thumps
  const buffers = {};       // decoded recordings: the voice lines
  const live = new Set();   // effect nodes still sounding (stopped on skip)

  const pref = (() => { try { return localStorage.getItem(PREF_KEY); } catch (e) { return null; } })();
  const savePref = (v) => { try { localStorage.setItem(PREF_KEY, v); } catch (e) { /* private mode */ } };

  let soundOn = pref !== 'off';   // on by default
  let introRunning = false;
  let away = false;               // scrolled past the intro

  const music = new Audio();
  music.src = MUSIC;
  music.loop = true;
  music.preload = 'none';

  // fetch the recordings early (small); decode once there is an audio context
  const raw = {};
  Object.entries(SAMPLES).forEach(([k, url]) => {
    raw[k] = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
  });

  const audible = () => !!ctx && ctx.state === 'running';

  /* --- the audio graph (only once the browser allows sound) ---------------- */

  function setup() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    ctx.onstatechange = () => refresh(0.8);
    if (ctx.state === 'suspended') ctx.resume();
    out = ctx.createDynamicsCompressor();
    out.threshold.value = -14;
    out.ratio.value = 4;
    out.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(out);
    fxGain = ctx.createGain();
    fxGain.gain.value = FX_LEVEL;
    fxGain.connect(out);
    try { ctx.createMediaElementSource(music).connect(musicGain); } catch (e) { /* plays unmixed */ }
    music.volume = 1;

    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    Object.entries(raw).forEach(([k, p]) => p.then((ab) => {
      if (!ab) return;
      ctx.decodeAudioData(ab, (buf) => { buffers[k] = buf; }, () => {});
    }));
  }

  /* --- music --------------------------------------------------------------- */

  function ramp(param, to, seconds) {
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(to, now + seconds);
  }

  let pauseTimer = null;
  function musicTo(level, seconds) {
    if (!ctx) return;
    clearTimeout(pauseTimer);
    if (level > 0) {
      if (music.preload === 'none') music.preload = 'auto';
      if (music.paused) music.play().catch(() => {});
    }
    ramp(musicGain.gain, level, seconds);
    if (level === 0) pauseTimer = setTimeout(() => music.pause(), seconds * 1000 + 50);
  }

  // music plays only while the intro runs, sound is on, and the intro is on screen
  function refresh(seconds = 0.8, cut = true) {
    const want = soundOn && introRunning && !away;
    if (!want && cut) stopFx();
    if (ctx) musicTo(want && audible() ? MUSIC_LEVEL : 0, seconds);
    if (btn) {
      const waiting = soundOn && !audible();      // on, but the browser is still waiting for a tap
      const playing = soundOn && audible();
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Turn sound off' : 'Turn sound on');
      btn.title = playing ? 'Sound on' : waiting ? 'Tap for sound' : 'Sound off';
      btn.classList.toggle('is-playing', playing);
      btn.classList.toggle('is-waiting', waiting && introRunning);
    }
  }

  /* --- effects ---------------------------------------------------------------- */

  function track(node, until) {
    live.add(node);
    node.onended = () => live.delete(node);
    node.start(ctx.currentTime);
    node.stop(until);
  }
  function stopFx() {
    live.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } });
    live.clear();
  }
  function amp(level, attack, decay, t0) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(level, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    g.connect(fxGain);
    return g;
  }
  // a pitched blip sliding from f0 to f1
  function tone(type, f0, f1, level, attack, decay, at = 0) {
    const t0 = ctx.currentTime + at;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.exponentialRampToValueAtTime(f1, t0 + attack + decay);
    o.connect(amp(level, attack, decay, t0));
    live.add(o);
    o.onended = () => live.delete(o);
    o.start(t0);
    o.stop(t0 + attack + decay + 0.05);
  }
  // filtered noise; the filter can sweep from f0 to f1
  function hiss(filter, f0, f1, q, level, attack, decay, at = 0) {
    const t0 = ctx.currentTime + at;
    const s = ctx.createBufferSource();
    s.buffer = noise;
    s.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = ctx.createBiquadFilter();
    f.type = filter;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t0);
    f.frequency.exponentialRampToValueAtTime(f1, t0 + attack + decay);
    s.connect(f).connect(amp(level, attack, decay, t0));
    live.add(s);
    s.onended = () => live.delete(s);
    s.start(t0, Math.random());
    s.stop(t0 + attack + decay + 0.05);
  }
  function sample(name, level, rate = 1) {
    if (!buffers[name]) return false;
    const s = ctx.createBufferSource();
    s.buffer = buffers[name];
    s.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = level;
    s.connect(g).connect(fxGain);
    track(s, ctx.currentTime + s.buffer.duration / rate + 0.05);
    return true;
  }

  /* --- voices: the spoken lines are recordings (see LINES); this cartoon
         gibberish, one short pitched blip per syllable, is for !@#$% and
         stands in for a line whose file hasn't loaded ------------------------- */

  const VOICES = {
    aiko: { lo: 560, hi: 780, wave: 'square', formant: 1900 },
    capiche: { lo: 310, hi: 440, wave: 'square', formant: 1300 },
    tiger: { lo: 120, hi: 175, wave: 'sawtooth', formant: 650 },
  };

  function blip(wave, f0, f1, level, dur, formant, at) {
    const t0 = ctx.currentTime + at;
    const o = ctx.createOscillator();
    o.type = wave;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = formant;
    f.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(level, t0 + 0.012);
    g.gain.setValueAtTime(level, t0 + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(f).connect(g).connect(fxGain);
    live.add(o);
    o.onended = () => live.delete(o);
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  }

  // ask: the last syllable rises (a question); rise: rises a little (ta-DA);
  // sigh: one long falling vowel (aah…); fast: quick-fire (!@#$%); loud: shouting
  function speak(who, syllables, { loud = false, ask = false, rise = false, sigh = false, fast = false } = {}, at = 0) {
    const v = VOICES[who];
    const gap = fast ? 0.065 : 0.11;
    const level = loud ? 0.5 : 0.34;
    for (let i = 0; i < syllables; i++) {
      const last = i === syllables - 1;
      const f0 = v.lo + Math.random() * (v.hi - v.lo);
      let f1 = f0 * (0.9 + Math.random() * 0.12);
      let dur = fast ? 0.05 : 0.08;
      if (last && ask) { f1 = f0 * 1.5; dur = 0.18; }
      if (last && rise) { f1 = f0 * 1.3; dur = 0.16; }
      if (sigh) { f1 = f0 * 0.62; dur = 0.5; }
      blip(v.wave, f0, f1, level, dur, v.formant, at + i * gap);
    }
  }

  const FX = {
    hop() { tone('sine', 170, 90, 0.22, 0.005, 0.09); },
    step(level = 0.28) {
      tone('sine', 120, 55, level, 0.004, 0.11);
      hiss('lowpass', 500, 200, 0.7, level * 0.35, 0.004, 0.06);
    },
    whoosh(big) {
      const d = big ? 0.55 : 0.28;
      hiss('bandpass', big ? 250 : 500, big ? 1400 : 2600, 1.2, big ? 0.32 : 0.22, d * 0.6, d * 0.5);
    },
    // a spoken line, or several at once (staggered by `gap`); loud lines are a touch faster and higher
    say(ids, { loud = false, gap = 0.04, ...opts } = {}) {
      [].concat(ids).forEach((id, k) => {
        const play = () => {
          if (!sample(id, loud ? 1 : 0.85, loud ? 1.08 : 1)) speak(id.split('-')[0], 2, { loud, ...opts });
        };
        if (k) setTimeout(play, k * gap * 1000); else play();
      });
    },
    // gibberish: 'aiko', 'capiche', 'tiger', or 'both' (Aiko and Capiche together)
    babble(who, syllables, opts) {
      (who === 'both' ? ['aiko', 'capiche'] : [who]).forEach((v, k) => speak(v, syllables, opts, k * 0.03));
    },
    toss() { hiss('bandpass', 800, 2400, 1.4, 0.16, 0.12, 0.12); },
    // a clay cup lands in a hand
    tok() {
      tone('triangle', 900, 620, 0.22, 0.002, 0.05);
      hiss('bandpass', 2500, 1800, 3, 0.16, 0.001, 0.03);
    },
    steam() { hiss('highpass', 3000, 5200, 0.5, 0.05, 0.3, 1.0); },
    purr() {
      if (!sample('purr', 0.95)) tone('sawtooth', 32, 30, 0.2, 0.15, 1.1);
    },
    gulp() {
      tone('sine', 380, 150, 0.25, 0.005, 0.12);
      tone('sine', 340, 130, 0.2, 0.005, 0.12, 0.17);
    },
    thud() {
      tone('sine', 85, 30, 1.0, 0.005, 0.5);
      hiss('lowpass', 700, 120, 0.7, 0.6, 0.004, 0.32);
      tone('triangle', 140, 60, 0.3, 0.003, 0.15);
    },
    // the giant kulhad lands: a thud with a hollow clay ring
    // something moving inside the upturned cup
    tada() {
      [523.25, 659.25, 783.99].forEach((f, i) => tone('triangle', f, f, 0.16, 0.006, 0.12, i * 0.08));
      tone('triangle', 1046.5, 1046, 0.18, 0.01, 0.7, 0.26);
      tone('triangle', 783.99, 783, 0.1, 0.01, 0.7, 0.26);
    },
    /* the fight: hits, the lightning bolt, the dust-up in the cloud, the roar */
    punch() {
      tone('sine', 170, 42, 0.95, 0.004, 0.24);
      hiss('lowpass', 2400, 400, 0.8, 0.55, 0.002, 0.07);
      tone('triangle', 420, 160, 0.18, 0.002, 0.06);
    },
    slap() {
      hiss('highpass', 1600, 900, 0.7, 0.75, 0.002, 0.08);
      tone('triangle', 260, 110, 0.4, 0.003, 0.12);
    },
    thunder() {
      hiss('highpass', 3500, 1500, 0.5, 0.45, 0.002, 0.06);          // the zap
      if (!sample('thunder', 0.75)) hiss('lowpass', 600, 80, 0.5, 0.8, 0.01, 1.4);
    },
    bonk() { tone('sine', 700 + Math.random() * 300, 280, 0.16, 0.003, 0.09); },
    scuffle(seconds) {
      // a little dust-up inside the cloud: light hits, slaps and bonks
      let at = 0.05;
      const kinds = ['punch', 'slap', 'bonk', 'whoosh', 'bonk', 'slap'];
      while (at < seconds - 0.1) {
        const k = kinds[Math.floor(Math.random() * kinds.length)];
        setTimeout(() => {
          if (!soundOn || away || !introRunning) return;
          if (k === 'punch') { tone('sine', 150, 50, 0.4, 0.004, 0.16); hiss('lowpass', 1800, 400, 0.8, 0.25, 0.002, 0.05); }
          else if (k === 'slap') { hiss('highpass', 1500, 900, 0.7, 0.3, 0.002, 0.06); }
          else if (k === 'whoosh') { hiss('bandpass', 600, 2200, 1.2, 0.12, 0.12, 0.1); }
          else FX.bonk();
        }, at * 1000);
        at += 0.11 + Math.random() * 0.14;
      }
    },
    poof() {
      hiss('lowpass', 2600, 250, 0.6, 0.6, 0.02, 0.6);
      tone('sine', 70, 35, 0.6, 0.01, 0.45);
    },
    roar() {
      if (!sample('roar', 1.0)) {
        // fallback growl if the recording didn't load
        tone('sawtooth', 110, 70, 0.35, 0.08, 1.1);
        hiss('bandpass', 500, 260, 1.5, 0.45, 0.08, 1.1);
      }
    },

    /* the other concepts' moments */
    pop() { tone('sine', 400, 900, 0.2, 0.003, 0.08); },              // something pops up
    rise() {                                                           // a table or door rises up
      tone('sine', 200, 480, 0.14, 0.02, 0.3);
      hiss('bandpass', 400, 1400, 1.2, 0.1, 0.15, 0.15);
    },
    boing() {
      tone('sine', 260, 620, 0.22, 0.004, 0.1);
      tone('sine', 620, 330, 0.18, 0.004, 0.22, 0.1);
    },
    snap() {                                                           // the noodle snaps
      hiss('highpass', 4500, 2200, 0.7, 0.8, 0.001, 0.05);
      tone('triangle', 1400, 260, 0.3, 0.002, 0.1);
      FX.boing();
    },
    plop() {                                                           // into the pot
      tone('sine', 950, 240, 0.32, 0.003, 0.12);
      hiss('lowpass', 1400, 400, 0.8, 0.18, 0.003, 0.12);
    },
    bubble(seconds = 1) {                                              // the pot bubbling
      let at = 0;
      while (at < seconds) {
        const f = 280 + Math.random() * 260;
        tone('sine', f, f * 2.2, 0.12, 0.004, 0.06, at);
        at += 0.07 + Math.random() * 0.11;
      }
    },
    sniff() {
      hiss('bandpass', 1800, 2800, 2, 0.14, 0.05, 0.1);
      hiss('bandpass', 1900, 3000, 2, 0.16, 0.05, 0.12, 0.2);
    },
    snore() {                                                          // the purr, slowed right down
      if (!sample('purr', 0.6, 0.55)) tone('sawtooth', 55, 45, 0.12, 0.3, 0.9);
    },
    munch() {                                                          // a bite of food
      tone('triangle', 320, 170, 0.22, 0.002, 0.06);
      hiss('bandpass', 2200, 1200, 1.5, 0.16, 0.002, 0.05);
    },
    burp() {
      tone('sawtooth', 115, 70, 0.22, 0.02, 0.38);
      hiss('lowpass', 500, 200, 0.8, 0.18, 0.02, 0.3);
    },
    clap() { hiss('bandpass', 2000, 1200, 0.8, 0.7, 0.002, 0.08); },   // the high five
    creak() {                                                          // the door swings open
      tone('sawtooth', 120, 70, 0.07, 0.05, 0.55);
      hiss('bandpass', 900, 600, 8, 0.12, 0.05, 0.55);
    },
    slam() {                                                           // …and shuts
      FX.thud();
      hiss('highpass', 1200, 600, 0.7, 0.25, 0.002, 0.08);
    },
    crash() {                                                          // plates go flying
      FX.thud();
      [2400, 3100, 4150, 2800].forEach((f, i) => tone('sine', f, f * 0.98, 0.12, 0.002, 0.35, i * 0.04));
      hiss('highpass', 3000, 1500, 0.6, 0.45, 0.002, 0.25);
    },
    page() { hiss('bandpass', 3200, 1200, 0.9, 0.2, 0.06, 0.18); },    // a page turns
    note(i = 0) {                                                      // the dance: one note of a pentatonic tune
      const f = [523.25, 587.33, 659.25, 783.99, 880][i % 5];
      tone('triangle', f, f, 0.14, 0.005, 0.25);
    },
    ding() {                                                           // the judge's score card
      tone('sine', 1318.5, 1317, 0.16, 0.002, 0.8);
      tone('sine', 2637, 2635, 0.05, 0.002, 0.5);
    },
    puff() { hiss('lowpass', 1800, 350, 0.7, 0.35, 0.02, 0.4); },     // a puff of Holi colour
    shutter() {                                                        // the camera
      hiss('highpass', 5000, 3000, 0.7, 0.5, 0.001, 0.02);
      hiss('highpass', 4000, 2500, 0.7, 0.4, 0.001, 0.03, 0.07);
      tone('triangle', 1800, 1500, 0.1, 0.001, 0.03);
    },
    whirr() {                                                          // …and the photo printing
      tone('square', 120, 140, 0.04, 0.02, 0.6);
      hiss('bandpass', 800, 900, 3, 0.06, 0.02, 0.6);
    },

    /* Navratri */
    clack(level = 0.8) {                                               // dandiya sticks
      tone('triangle', 1650, 1250, 0.28 * level, 0.001, 0.05);
      hiss('bandpass', 2600, 1900, 3, 0.45 * level, 0.001, 0.04);
      tone('sine', 820, 700, 0.16 * level, 0.001, 0.07);
    },
    dhol(high = 0) {                                                   // the dhol: a deep 'dhum' or a sharp 'ta'
      if (high) {
        tone('triangle', 420, 300, 0.25, 0.002, 0.08);
        hiss('bandpass', 2200, 1400, 1.2, 0.3, 0.001, 0.05);
      } else {
        tone('sine', 110, 50, 0.9, 0.004, 0.32);
        hiss('lowpass', 600, 150, 0.7, 0.35, 0.003, 0.12);
      }
    },
    whirl() {                                                          // the garba twirl, spinning up
      hiss('bandpass', 300, 3200, 2, 0.28, 1.0, 0.4);
      tone('sine', 300, 900, 0.06, 0.8, 0.5);
    },

    sparkle() {
      [1568, 2093, 2637, 3136].forEach((f, i) => tone('sine', f, f * 0.995, 0.11, 0.004, 0.45, i * 0.06));
    },
    chime() {
      tone('sine', 523.25, 523, 0.09, 0.01, 1.4);
      tone('sine', 783.99, 783, 0.07, 0.01, 1.6, 0.08);
    },
  };

  /* --- starting the sound ---------------------------------------------------- */

  // with the intro: try to play straight away (some browsers allow it, e.g. sites
  // you often play sound on); if not, wait for the first click, tap or key press
  function tryAutoplay() {
    if (!soundOn || ctx) return;
    music.preload = 'auto';
    music.volume = 0;                       // silent probe; the mixer sets the real level
    const p = music.play();
    if (!p || !p.then) return;
    p.then(() => {
      setup();
      refresh(1.2);
    }).catch(() => {
      music.volume = 1;
      refresh(0);                           // shows "Tap for sound"
    });
  }

  // Safari only lets music start if play() is called right inside the tap
  function primeMusic() {
    music.preload = 'auto';
    if (music.paused) music.play().catch(() => {});   // silent until the mixer fades it in
  }

  const FIRST = ['pointerdown', 'keydown', 'touchend'];
  function onFirst(e) {
    const t = e.target instanceof Element ? e.target : null;
    if (t && (btn && btn.contains(t))) return;             // the button handles itself
    if (t && t.closest('.skip')) return;                   // skipping: no point starting sound
    if (e.type === 'keydown' && e.key === 'Escape') return;
    if (!soundOn || audible()) { disarm(); return; }
    if (!introRunning || away) return;                     // the rest of the site stays silent
    setup();                                               // inside the tap: allowed now
    primeMusic();
    refresh(1.2);
    if (ctx) disarm();
  }
  function disarm() {
    FIRST.forEach((type) => window.removeEventListener(type, onFirst, true));
  }
  FIRST.forEach((type) => window.addEventListener(type, onFirst, true));

  /* --- the intro tells us what is happening ------------------------------------- */

  document.addEventListener('intro:start', () => {
    introRunning = true;
    away = false;
    music.currentTime = 0;
    if (soundOn && !ctx) tryAutoplay();
    else if (soundOn) setup();                // Replay is a click, so this is allowed
    refresh(1.2);
  });
  document.addEventListener('intro:skip', () => { introRunning = false; refresh(0.6); });
  document.addEventListener('intro:done', () => { introRunning = false; refresh(2.5, false); });

  // scrolled down to the home page: silence; back up while the intro still runs: sound again
  if (stage) {
    window.addEventListener('scroll', () => {
      const nowAway = window.scrollY > stage.offsetHeight * 0.5;
      if (nowAway !== away) { away = nowAway; refresh(0.8); }
    }, { passive: true });
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) { music.pause(); ctx.suspend(); }
    else if (soundOn && introRunning && !away) { ctx.resume(); music.play().catch(() => {}); }
  });

  // the sound button on the intro: "Tap for sound" → on → off
  if (btn) {
    btn.addEventListener('click', () => {
      if (soundOn && audible()) {
        soundOn = false;
        savePref('off');
      } else {
        soundOn = true;
        savePref('on');
        setup();
        if (introRunning) primeMusic();
      }
      refresh(0.6);
    });
    refresh(0);
  }

  return {
    // intro.js calls this at each moment of the story
    fx(name, ...args) {
      if (!audible() || !soundOn || away || !introRunning || document.hidden) return;
      if (name === 'music-out') { musicTo(0, 2.5); return; }
      if (FX[name]) FX[name](...args);
    },
  };
})();

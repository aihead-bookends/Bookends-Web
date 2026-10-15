/* ==========================================================================
   Bookends Hospitality: sound for the intro only
   Sound is on by default: music under the fight (fading out at the title)
   and effects on cue (intro.js calls BOOKENDS_SOUND.fx('punch') etc. at each
   moment). The rest of the site is silent.

   Browsers only let a page make sound once the visitor has clicked, tapped
   or pressed a key. So the music tries to start with the intro; if the
   browser says no, it starts on the visitor's first click, tap or key press,
   and the sound button shows "Tap for sound" until then. Muting with the
   button is remembered for the next visit.

   Recordings: roar and thunder (public domain, see assets/audio/CREDITS.txt).
   Every other effect is generated here with Web Audio.
   ========================================================================== */
window.BOOKENDS_SOUND = (() => {
  'use strict';

  const MUSIC = 'assets/audio/bossa-antigua.m4a';
  const SAMPLES = { roar: 'assets/audio/roar.m4a', thunder: 'assets/audio/thunder.m4a' };
  const MUSIC_LEVEL = 0.4;
  const FX_LEVEL = 0.9;
  const PREF_KEY = 'bookends-sound';   // 'off' once the visitor mutes

  const stage = document.getElementById('stage');
  const btn = document.getElementById('sound-toggle');

  let ctx = null;
  let out = null;           // master: compressor → speakers
  let musicGain = null;
  let fxGain = null;
  let noise = null;         // a white-noise buffer for whooshes, hits and poofs
  const buffers = {};       // decoded roar / thunder
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

  // fetch the two recordings early (small); decode once there is an audio context
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
  function sample(name, level) {
    if (!buffers[name]) return false;
    const s = ctx.createBufferSource();
    s.buffer = buffers[name];
    const g = ctx.createGain();
    g.gain.value = level;
    s.connect(g).connect(fxGain);
    track(s, ctx.currentTime + s.buffer.duration + 0.05);
    return true;
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
    thud() {
      tone('sine', 85, 30, 1.0, 0.005, 0.5);
      hiss('lowpass', 700, 120, 0.7, 0.6, 0.004, 0.32);
      tone('triangle', 140, 60, 0.3, 0.003, 0.15);
    },
    poof() {
      hiss('lowpass', 2600, 250, 0.6, 0.6, 0.02, 0.6);
      tone('sine', 70, 35, 0.6, 0.01, 0.45);
    },
    sparkle() {
      [1568, 2093, 2637, 3136].forEach((f, i) => tone('sine', f, f * 0.995, 0.11, 0.004, 0.45, i * 0.06));
    },
    roar() {
      if (!sample('roar', 1.0)) {
        // fallback growl if the recording didn't load
        tone('sawtooth', 110, 70, 0.35, 0.08, 1.1);
        hiss('bandpass', 500, 260, 1.5, 0.45, 0.08, 1.1);
      }
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
    // intro.js calls this at each moment of the fight
    fx(name, ...args) {
      if (!audible() || !soundOn || away || !introRunning || document.hidden) return;
      if (name === 'music-out') { musicTo(0, 2.5); return; }
      if (FX[name]) FX[name](...args);
    },
  };
})();

/* ==========================================================================
   Bookends Hospitality: sound for the intro only
   An Enter screen asks "with sound / without sound" before the intro starts
   (browsers only allow sound after a click). With sound, music plays under
   the fight and fades out as the title appears, and effects play on cue
   (intro.js calls BOOKENDS_SOUND.fx('punch') etc. at each moment). The rest
   of the site is silent.

   Recordings: roar and thunder (public domain, see assets/audio/CREDITS.txt).
   Every other effect is generated here with Web Audio.
   ========================================================================== */
window.BOOKENDS_SOUND = (() => {
  'use strict';

  const MUSIC = 'assets/audio/bossa-antigua.m4a';
  const SAMPLES = { roar: 'assets/audio/roar.m4a', thunder: 'assets/audio/thunder.m4a' };
  const MUSIC_LEVEL = 0.4;
  const FX_LEVEL = 0.9;

  const stage = document.getElementById('stage');
  const gate = document.getElementById('gate');
  const btn = document.getElementById('sound-toggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const devFreeze = new URLSearchParams(location.search).has('t');

  let ctx = null;
  let out = null;           // master: compressor → speakers
  let musicGain = null;
  let fxGain = null;
  let noise = null;         // a white-noise buffer for whooshes, hits and poofs
  const buffers = {};       // decoded roar / thunder
  const live = new Set();   // effect nodes still sounding (stopped on skip)

  let soundOn = false;      // the visitor's choice (Enter screen / button)
  let introRunning = false;
  let away = false;         // scrolled past the intro

  const music = new Audio();
  music.src = MUSIC;
  music.loop = true;
  music.preload = 'none';

  // fetch the two recordings early (small); decode once there is an audio context
  const raw = {};
  Object.entries(SAMPLES).forEach(([k, url]) => {
    raw[k] = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
  });

  /* --- the audio graph (created inside a click, as browsers require) ------ */

  function setup() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
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

  // music plays only while the intro runs, the visitor wants sound, and the intro is on screen
  function refresh(seconds = 0.8, cut = true) {
    const want = soundOn && introRunning && !away;
    if (!want && cut) stopFx();
    if (ctx) musicTo(want ? MUSIC_LEVEL : 0, seconds);
    if (btn) {
      btn.setAttribute('aria-pressed', String(soundOn));
      btn.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
      btn.title = soundOn ? 'Sound on' : 'Sound off';
      btn.classList.toggle('is-playing', soundOn);
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

  /* --- the Enter screen ------------------------------------------------------------- */

  const needsGate = !!(gate && stage && !reduceMotion && !devFreeze && window.gsap);
  const ready = new Promise((resolve) => {
    if (!needsGate) {
      if (gate) gate.hidden = true;
      resolve();
      return;
    }
    document.documentElement.classList.add('is-gated');
    const primary = gate.querySelector('[data-enter="sound"]');
    if (primary) primary.focus({ preventScroll: true });
    gate.querySelectorAll('[data-enter]').forEach((b) => b.addEventListener('click', () => {
      soundOn = b.dataset.enter === 'sound';
      if (soundOn) setup();
      gate.classList.add('is-leaving');
      document.documentElement.classList.remove('is-gated');
      setTimeout(() => { gate.hidden = true; }, 600);
      resolve();
    }, { once: true }));
  });

  /* --- the intro tells us what is happening ------------------------------------- */

  document.addEventListener('intro:start', () => {
    introRunning = true;
    if (soundOn && ctx) music.currentTime = 0;
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

  // the sound button on the intro
  if (btn) {
    btn.addEventListener('click', () => {
      soundOn = !soundOn;
      if (soundOn) setup();
      refresh(0.6);
    });
    refresh(0);
  }

  return {
    ready,
    // intro.js calls this at each moment of the fight
    fx(name, ...args) {
      if (!ctx || !soundOn || away || !introRunning || document.hidden) return;
      if (name === 'music-out') { musicTo(0, 2.5); return; }
      if (FX[name]) FX[name](...args);
    },
  };
})();

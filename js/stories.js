/* ==========================================================================
   Bookends Hospitality: success stories page
   The journey stacks up as you scroll.
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // our journey: a stack of cards (css/stories.css). Each card knows its place in the stack, and,
  // as the cards after it slide up over it, how deep it now lies (up to 4), so it can sink back.
  const moments = [...document.querySelectorAll('.timeline .moment')];
  moments.forEach((m, i) => m.style.setProperty('--i', i));
  let unwinding = false;                         // the ending has the cards (below)
  if (moments.length && !reduceMotion) {
    let queued = false;
    const settle = () => {
      queued = false;
      if (unwinding) return;
      // how far each card has come over the one before it: 0 just touching, 1 lying on it
      const over = moments.map((m, i) => {
        if (!i) return 0;
        const prev = moments[i - 1];
        const prevBottom = prev.getBoundingClientRect().top + prev.offsetHeight;
        return Math.min(1, Math.max(0, (prevBottom - m.getBoundingClientRect().top) / prev.offsetHeight));
      });
      let depth = 0;
      for (let i = moments.length - 1; i >= 0; i--) {
        moments[i].style.setProperty('--depth', Math.min(depth, 4).toFixed(3));
        depth += over[i];
      }
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(settle); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    settle();
  }

  // …and how the story ends (.journey-end): with the last card on top, scrolling on unwinds the
  // stack from the top down, each card spinning and shrinking into the middle of the screen, until
  // they're all gone into one point; out of it pops Caiko, its mandala opens behind, and the logo
  // and the line come up underneath. Laid out as it is, the page simply ends on Caiko, so with
  // reduced motion (or no script) that's what you see.
  const end = document.querySelector('.journey-end');
  if (end && moments.length && !reduceMotion) {
    end.classList.add('is-live');
    const stage = end.querySelector('.journey-end__stage');
    const art = end.querySelector('.journey-end__art');
    const caiko = end.querySelector('.journey-end__caiko');
    const mandala = end.querySelector('.journey-end__mandala');
    const logo = end.querySelector('.journey-end__logo');
    const line = end.querySelector('.journey-end__line');
    const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const pop = (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);   // past 1, then back
    let cards = [];
    // where each card sits when stuck, without any transform: its middle across, its top, its height
    const measure = () => {
      moments.forEach((m) => { m.style.transform = 'none'; });
      cards = moments.map((m) => {
        const r = m.getBoundingClientRect();
        return { x: r.left + r.width / 2, top: parseFloat(getComputedStyle(m).top) || 0, h: r.height };
      });
      moments.forEach((m) => { m.style.transform = ''; });
    };
    let queued = false;
    const play = () => {
      queued = false;
      const run = end.offsetHeight - stage.offsetHeight;
      const p = clamp01((headerH() - end.getBoundingClientRect().top) / run);
      unwinding = p > 0;
      const r = art.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const n = moments.length;
      moments.forEach((m, i) => {
        // the top card goes first, then the one under it, and so on down the stack
        const t = ease(clamp01((p - (n - 1 - i) * 0.03) / 0.3));
        if (!t) {
          m.style.transform = '';
          m.style.opacity = '';
          m.style.borderRadius = '';
          return;
        }
        const base = 1 - Math.min(+m.style.getPropertyValue('--depth') || 0, 4) * 0.035;
        const scale = base + (0.06 - base) * t;
        const k = cards[i];
        const dx = (cx - k.x) * t;
        const dy = (cy - k.top - (k.h * scale) / 2) * t;
        const spin = (i % 2 ? 1 : -1) * (30 + i * 8) * t;
        m.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${spin}deg)`;
        m.style.borderRadius = `${24 + 176 * t}px`;
        m.style.opacity = String(1 - clamp01((t - 0.7) / 0.3));
      });
      const c = clamp01((p - 0.5) / 0.16);
      caiko.style.opacity = c ? 1 : 0;
      caiko.style.transform = `scale(${pop(c) * c}) rotate(${(1 - c) * -24}deg)`;
      const md = ease(clamp01((p - 0.52) / 0.24));
      mandala.style.opacity = String(0.12 * md);
      mandala.style.transform = `scale(${0.4 + 0.6 * md}) rotate(${(1 - md) * -120}deg)`;
      const l = ease(clamp01((p - 0.68) / 0.18));
      logo.style.opacity = String(l);
      logo.style.transform = `translateY(${(1 - l) * 26}px)`;
      line.style.opacity = String(ease(clamp01((p - 0.76) / 0.16)));
      line.style.transform = `translateY(${(1 - ease(clamp01((p - 0.76) / 0.16))) * 18}px)`;
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(play); } };
    measure();
    play();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', () => { measure(); queue(); });
  }
})();

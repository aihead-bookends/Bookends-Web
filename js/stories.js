/* ==========================================================================
   Bookends Hospitality: success stories page
   The journey stacks up as you scroll, and the real figures (data-count) count up the first time
   they come into view.
   ========================================================================== */
(() => {
  'use strict';

  const counters = [...document.querySelectorAll('[data-count]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // our journey: a stack of cards (css/stories.css). Each card knows its place in the stack, and,
  // as the cards after it slide up over it, how deep it now lies (up to 4), so it can sink back.
  const moments = [...document.querySelectorAll('.timeline .moment')];
  moments.forEach((m, i) => m.style.setProperty('--i', i));
  if (moments.length && !reduceMotion) {
    let queued = false;
    const settle = () => {
      queued = false;
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

  if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) return;

  const DURATION = 1400;
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function count(el) {
    const to = Number(el.dataset.count);
    // a year counts up from a few years earlier, not from zero
    const from = 'plain' in el.dataset ? to - 6 : 0;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      el.textContent = String(Math.round(from + (to - from) * ease(t)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // always land on the real figure, even if the browser pauses the animation
    setTimeout(() => { el.textContent = String(to); }, DURATION + 300);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      count(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => io.observe(el));
})();

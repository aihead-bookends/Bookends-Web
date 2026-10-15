/* ==========================================================================
   Bookends Hospitality: success stories page
   The real figures (data-count) count up the first time they come into view.
   ========================================================================== */
(() => {
  'use strict';

  const counters = [...document.querySelectorAll('[data-count]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

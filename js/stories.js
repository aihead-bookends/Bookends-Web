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

  // …and how the story ends (.journey-end): as you scroll on, the moments, lying in a pile like
  // the cards did, stand up one by one as books on a shelf; Aiko and Capiche slide in from the
  // sides as the bookends; and the Bookends logo comes up over them. It's all worked out from the
  // finished layout, so anything left unplayed (reduced motion, no script) is simply the shelf.
  const end = document.querySelector('.journey-end');
  if (end && !reduceMotion) {
    end.classList.add('is-live');
    const stage = end.querySelector('.journey-end__stage');
    const books = [...end.querySelectorAll('.book')];
    const ends = [...end.querySelectorAll('.shelf__end')];
    const logo = end.querySelector('.journey-end__logo');
    const line = end.querySelector('.journey-end__line');
    const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const overshoot = (t) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
    let pile = [];
    let away = [];
    const measure = () => {
      [...books, ...ends].forEach((el) => { el.style.transform = ''; });
      const shelf = books[0].parentElement.getBoundingClientRect();
      const mid = shelf.left + shelf.width / 2;
      let y = shelf.bottom;                          // the first book at the bottom of the pile
      pile = books.map((b) => {
        const r = b.getBoundingClientRect();
        y -= r.width;                                // lying down, a book is as tall as its spine is wide
        return { x: mid - (r.left + r.width / 2), y: y + r.width / 2 - (r.top + r.height / 2) };
      });
      // each bookend starts just off its side of the screen
      away = ends.map((e, i) => { const r = e.getBoundingClientRect(); return i ? innerWidth - r.left + 20 : -(r.right + 20); });
    };
    let queued = false;
    const play = () => {
      queued = false;
      const run = end.offsetHeight - stage.offsetHeight;
      const p = clamp01((headerH() - end.getBoundingClientRect().top) / run);
      books.forEach((b, i) => {
        const t = ease(clamp01((p - 0.1 - i * 0.032) / 0.26));
        b.style.transform = `translate(${pile[i].x * (1 - t)}px, ${pile[i].y * (1 - t)}px) rotate(${-90 * (1 - t)}deg)`;
      });
      const e = clamp01((p - 0.5) / 0.2);
      ends.forEach((el, i) => {
        el.style.transform = `translateX(${away[i] * (1 - overshoot(e))}px)`;
      });
      const l = ease(clamp01((p - 0.72) / 0.18));
      logo.style.opacity = l;
      logo.style.transform = `translateY(${(1 - l) * 28}px) scale(${0.9 + 0.1 * l})`;
      line.style.opacity = ease(clamp01((p - 0.8) / 0.15));
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(play); } };
    measure();
    play();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', () => { measure(); queue(); });
    addEventListener('load', () => { measure(); queue(); });   // once the bookends' pictures have their size
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

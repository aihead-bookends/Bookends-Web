/* ==========================================================================
   Bookends Hospitality: home page behaviour (below the intro)
   ========================================================================== */
(() => {
  'use strict';

  /* All outside links live here. Fill one in and every button that uses it
     updates: booking/menu/maps/instagram are full URLs, phone is a number,
     email an address. An empty one keeps its button but goes nowhere. */
  const LINKS = {
    aiko:    { booking: '', menu: '', maps: '', phone: '', instagram: '' },
    beshak:  { booking: '', menu: '', maps: '', phone: '', instagram: '' },
    capiche: { booking: '', menu: '', maps: '', phone: '', instagram: '' },
    group:   { phone: '', email: '', instagram: '' },
  };

  const ESSENCE = window.BOOKENDS_ESSENCE;
  const stage = document.getElementById('stage');
  const header = document.getElementById('site-header');

  // links
  document.querySelectorAll('[data-link]').forEach((a) => {
    const [brand, key] = a.dataset.link.split('.');
    const value = (LINKS[brand] || {})[key];
    if (!value) {
      a.classList.add('is-todo');
      a.title = 'Link coming soon';
      if (a.getAttribute('href') === '#') a.addEventListener('click', (e) => e.preventDefault());
      return;
    }
    if (key === 'phone') {
      a.href = `tel:${value.replace(/[^\d+]/g, '')}`;
      if (/^\[.*\]$/.test(a.textContent.trim())) a.textContent = value;
    } else if (key === 'email') {
      a.href = `mailto:${value}`;
      if (/^\[.*\]$/.test(a.textContent.trim())) a.textContent = value;
    } else {
      a.href = value;
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  // each country's landmark in its card, and the mandala behind the About art
  const svg = (body) =>
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  if (ESSENCE) {
    document.querySelectorAll('[data-icon]').forEach((el) => {
      const body = ESSENCE.icons[el.dataset.icon];
      if (body) el.innerHTML = svg(body);
    });
    document.querySelectorAll('[data-mandala]').forEach((el) => { el.innerHTML = ESSENCE.mandala(); });
  }

  // the header slides in once the intro is mostly scrolled past
  if (stage && header && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-shown', entry.intersectionRatio < 0.2);
    }, { threshold: [0, 0.2, 0.5, 1] }).observe(stage);
  } else if (header) {
    header.classList.add('is-shown');
  }

  // "Explore" cue once the intro has finished (hidden again on replay)
  document.addEventListener('intro:done', () => stage && stage.classList.add('is-done'));
  document.addEventListener('intro:start', () => stage && stage.classList.remove('is-done'));

  // 2s after the intro's closing title, glide down to the home page, unless the
  // visitor is already scrolling, tapping or typing (or the intro is frozen with ?t=)
  const home = document.getElementById('home');
  const AUTO_SCROLL_MS = 2000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoScroll;
  const cancelAutoScroll = () => {
    clearTimeout(autoScroll);
    autoScroll = null;
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.removeEventListener(type, cancelAutoScroll));
  };
  document.addEventListener('intro:done', () => {
    if (!home || !stage || new URLSearchParams(location.search).has('t')) return;
    cancelAutoScroll();
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.addEventListener(type, cancelAutoScroll, { passive: true }));
    autoScroll = setTimeout(() => {
      cancelAutoScroll();
      if (window.scrollY > stage.offsetHeight * 0.3) return; // already on their way down
      home.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }, AUTO_SCROLL_MS);
  });
  document.addEventListener('intro:start', cancelAutoScroll);

  // sections fade up as they come into view
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();

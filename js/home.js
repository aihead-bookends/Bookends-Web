/* ==========================================================================
   Bookends Hospitality: home page behaviour (below the intro)
   ========================================================================== */
(() => {
  'use strict';

  /* All outside links live here. Fill one in and every button that uses it
     updates: booking / menu / maps / instagram are full URLs, phone is a number,
     email an address. An empty one keeps its button but goes nowhere. */
  const LINKS = {
    // each brand
    aiko:    { menu: '', instagram: '' },
    beshak:  { menu: '', instagram: '' },
    capiche: { menu: '', instagram: '' },

    // each outlet: its booking page, Google Maps link and phone number
    'aiko-surat':         { booking: '', maps: '', phone: '' },
    'aiko-ahmedabad':     { booking: '', maps: '', phone: '' },
    'beshak-dumas':       { booking: '', maps: '', phone: '' },   // Dumas Road, Surat
    'capiche-piplod':     { booking: '', maps: '', phone: '' },   // Gymkhana Road, Piplod, Surat
    'capiche-vesu':       { booking: '', maps: '', phone: '' },   // IWC, Vesu, Surat
    'capiche-ambli':      { booking: '', maps: '', phone: '' },   // Ason Vista, Ambli, Ahmedabad
    'capiche-uni':        { booking: '', maps: '', phone: '' },   // Adore Aspire, Ahmedabad

    // Bookends Hospitality itself
    group:   { phone: '', email: '', instagram: '' },

    // press articles on the Success stories page
    press:   { article1: '', article2: '', article3: '' },
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

  /* --- from the intro to the home page --------------------------------------- */

  const home = document.getElementById('home');
  const introLayer = document.getElementById('stage-inner');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INPUT = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  const GLIDE = 1.6;            // seconds, start to settle
  const AUTO_SCROLL_MS = 2000;  // pause on the intro's closing title before gliding on

  // as the page scrolls away from the intro, it drifts down a little and fades,
  // so it dissolves into the home page instead of being pushed off the top
  if (stage && introLayer && !reduceMotion) {
    let ticking = false;
    const fadeIntro = () => {
      ticking = false;
      const p = Math.min(1, Math.max(0, window.scrollY / stage.offsetHeight));
      introLayer.style.transform = p ? `translate3d(0, ${(p * 32).toFixed(2)}%, 0)` : '';
      introLayer.style.opacity = p ? Math.max(0, 1 - p * 1.25).toFixed(3) : '';
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(fadeIntro); }
    }, { passive: true });
    fadeIntro();
  }

  // an eased glide to a section; any scroll, tap or key press stops it on the spot
  let glide;
  function stopGlide() {
    if (glide) glide.kill();
  }
  function glideTo(el) {
    stopGlide();
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const target = Math.round(el.getBoundingClientRect().top + window.scrollY - margin);
    const reveals = [...el.querySelectorAll('.reveal')];
    if (reduceMotion || !window.gsap) {
      reveals.forEach((r) => r.classList.add('is-in'));
      window.scrollTo({ top: target, behavior: 'auto' });
      return;
    }
    const root = document.documentElement;
    const pos = { y: window.scrollY };
    let shown = false;
    const end = () => {
      root.style.scrollBehavior = '';
      INPUT.forEach((type) => window.removeEventListener(type, stopGlide));
      glide = null;
    };
    root.style.scrollBehavior = 'auto';           // the CSS smooth scroll would fight every step
    INPUT.forEach((type) => window.addEventListener(type, stopGlide, { passive: true }));
    glide = window.gsap.to(pos, {
      y: target,
      duration: GLIDE,
      ease: 'power3.inOut',
      onUpdate() {
        window.scrollTo(0, pos.y);
        // the section builds in, one piece after another, as it arrives
        if (!shown && this.progress() > 0.32) {
          shown = true;
          reveals.forEach((r) => r.classList.add('is-in'));
        }
      },
      onComplete: end,
      onInterrupt: end,
    });
  }

  // the Explore cue at the bottom of the intro uses the same glide
  document.querySelectorAll('.scroll-cue').forEach((a) => a.addEventListener('click', (e) => {
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    glideTo(el);
  }));

  // 2s after the intro's closing title, glide on to the home page, unless the
  // visitor is already scrolling, tapping or typing (or the intro is frozen with ?t=)
  let autoScroll;
  const cancelAutoScroll = () => {
    clearTimeout(autoScroll);
    autoScroll = null;
    INPUT.forEach((type) => window.removeEventListener(type, cancelAutoScroll));
  };
  document.addEventListener('intro:done', () => {
    if (!home || !stage || new URLSearchParams(location.search).has('t')) return;
    cancelAutoScroll();
    INPUT.forEach((type) => window.addEventListener(type, cancelAutoScroll, { passive: true }));
    autoScroll = setTimeout(() => {
      cancelAutoScroll();
      if (window.scrollY > stage.offsetHeight * 0.3) return; // already on their way down
      glideTo(home);
    }, AUTO_SCROLL_MS);
  });
  document.addEventListener('intro:start', () => {
    cancelAutoScroll();
    stopGlide();
  });

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

/* ==========================================================================
   Bookends Hospitality: event gallery
   ========================================================================== */
(() => {
  'use strict';

  /* The gallery. To add a photo, put the file in assets/events/ and add a line:
       { src: 'assets/events/diwali-2026.jpg', brand: 'beshak', title: 'Diwali dinner', date: 'Nov 2026' },
     brand: 'aiko' | 'beshak' | 'capiche'
     size:  'wide' (two columns) or 'tall' (two rows), for a few standout photos
     An entry without src shows a placeholder tile until its photo is added. */
  // in this order, 6 regular + 3 wide + 3 tall tiles fill the 3-column grid edge to edge
  const EVENTS = [
    { src: '', brand: 'beshak',  size: 'wide', title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'aiko',                   title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'capiche', size: 'tall', title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'beshak',                 title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'capiche',                title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'aiko',    size: 'wide', title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'aiko',                   title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'capiche', size: 'tall', title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'beshak',  size: 'tall', title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'beshak',                 title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'aiko',    size: 'wide', title: '[Event name]', date: '[Month Year]' },
    { src: '', brand: 'capiche',                title: '[Event name]', date: '[Month Year]' },
  ];

  const BRANDS = {
    aiko:    { name: 'Aiko',    cuisine: 'Korean',  icons: ['seoulTower', 'palace', 'lantern', 'mugunghwa', 'fan', 'taegeuk'] },
    beshak:  { name: 'Beshak',  cuisine: 'Indian',  icons: ['tajMahal', 'lotus', 'peacock', 'diya', 'elephant', 'indiaGate'] },
    capiche: { name: 'Capiche', cuisine: 'Italian', icons: ['colosseum', 'pisa', 'gondola', 'vespa', 'olive', 'mask'] },
  };

  const ESSENCE = window.BOOKENDS_ESSENCE;
  const grid = document.getElementById('gallery');
  const count = document.getElementById('gallery-count');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const box = document.getElementById('lightbox');
  if (!grid || !box) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icon = (name) => (ESSENCE && ESSENCE.icons[name]
    ? `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ESSENCE.icons[name]}</svg>`
    : '');
  const iconFor = (ev, i) => BRANDS[ev.brand].icons[i % BRANDS[ev.brand].icons.length];

  // a photo, or a placeholder tile with the brand's landmark
  function media(ev, i, large = false) {
    if (ev.src) {
      return `<img src="${ev.src}" alt="${ev.alt || `${ev.title}, ${BRANDS[ev.brand].name}`}"${large ? '' : ' loading="lazy"'}>`;
    }
    return `<span class="ph ph--${ev.brand}">${icon(iconFor(ev, i))}<span class="ph__label">[Event photo]</span></span>`;
  }

  /* --- the grid ---------------------------------------------------------- */

  grid.innerHTML = EVENTS.map((ev, i) => {
    const b = BRANDS[ev.brand];
    return `<li class="tile${ev.size ? ` tile--${ev.size}` : ''}" data-brand="${ev.brand}">
      <button class="tile__btn" type="button" data-index="${i}" aria-label="Open ${ev.title}, ${b.name}${ev.date ? `, ${ev.date}` : ''}">
        ${media(ev, i)}
        <span class="tile__cap"><b>${ev.title}</b><span>${b.name}${ev.date ? ` · ${ev.date}` : ''}</span></span>
      </button>
    </li>`;
  }).join('');
  const tiles = [...grid.children];
  // each tile gets its own name, so filtering animates tiles to their new spots
  tiles.forEach((t, i) => { t.style.viewTransitionName = `tile-${i}`; });

  /* --- filters: All · Aiko · Beshak · Capiche ----------------------------- */

  let active = 'all';
  const visible = () => tiles.filter((t) => !t.hidden).map((t) => Number(t.querySelector('button').dataset.index));

  function applyFilter(value, animate = true) {
    active = value;
    filters.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filter === value)));
    const run = () => {
      tiles.forEach((t) => { t.hidden = value !== 'all' && t.dataset.brand !== value; });
      const n = visible().length;
      count.textContent = `${n} ${n === 1 ? 'moment' : 'moments'}`;
    };
    // a smooth reflow where the browser supports it
    if (animate && document.startViewTransition && !reduceMotion) document.startViewTransition(run);
    else run();
    const url = new URL(location.href);
    if (value === 'all') url.searchParams.delete('brand'); else url.searchParams.set('brand', value);
    history.replaceState(null, '', url);
  }
  filters.forEach((f) => f.addEventListener('click', () => applyFilter(f.dataset.filter)));
  const start = new URLSearchParams(location.search).get('brand');
  applyFilter(BRANDS[start] ? start : 'all', false);

  /* --- lightbox -------------------------------------------------------------- */

  const stageEl = box.querySelector('.lightbox__media');
  const title = box.querySelector('.lightbox__title');
  const meta = box.querySelector('.lightbox__meta');
  const caption = box.querySelector('.lightbox__caption');
  const pos = box.querySelector('.lightbox__count');
  let current = 0;
  let opener = null;

  function show(i) {
    current = i;
    const ev = EVENTS[i];
    const b = BRANDS[ev.brand];
    const list = visible();
    stageEl.innerHTML = media(ev, i, true);
    title.textContent = ev.title;
    meta.textContent = `${b.name} · ${b.cuisine}${ev.date ? ` · ${ev.date}` : ''}`;
    caption.textContent = ev.caption || '';
    caption.hidden = !ev.caption;
    pos.textContent = `${list.indexOf(i) + 1} / ${list.length}`;
  }
  function step(dir) {
    const list = visible();
    show(list[(list.indexOf(current) + dir + list.length) % list.length]);
  }
  function open(i, from) {
    opener = from;
    show(i);
    box.showModal();
    document.documentElement.classList.add('is-locked');
  }
  function close() {
    box.close();
  }
  box.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    if (opener) opener.focus();
  });

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.tile__btn');
    if (btn) open(Number(btn.dataset.index), btn);
  });
  box.querySelector('.lightbox__prev').addEventListener('click', () => step(-1));
  box.querySelector('.lightbox__next').addEventListener('click', () => step(1));
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.addEventListener('click', (e) => { if (e.target === box) close(); });   // the dark backdrop
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // swipe left / right on phones
  let touchX = null;
  box.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });
})();

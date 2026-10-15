/* ==========================================================================
   Bookends Hospitality: event gallery
   ========================================================================== */
(() => {
  'use strict';

  /* The gallery. To add a photo, put the file in assets/events/ and add a line:
       { src: 'assets/events/diwali-2026.jpg', brand: 'beshak', title: 'Diwali dinner', date: 'Nov 2026' },
     brand: 'aiko' | 'beshak' | 'capiche'
     size:  'wide' (two columns) or 'tall' (two rows), for a few standout photos
     thumb: an optional smaller copy (about 800px) for the grid; the viewer always shows src
     An entry without src shows a placeholder tile until its photo is added. */
  // SAMPLE photos from Pexels (free to use; see assets/events/CREDITS.txt) until the real event photos
  // are in. In this order, 6 regular + 3 wide + 3 tall tiles fill the 3-column grid edge to edge.
  const EVENTS = [
    { src: 'assets/events/beshak-diwali-diyas.jpg', thumb: 'assets/events/beshak-diwali-diyas-sm.jpg', brand: 'beshak', size: 'wide', 
      title: '[Diwali night]', date: '[Month Year]', alt: 'Lit diyas and marigold petals arranged on a rangoli' },
    { src: 'assets/events/aiko-sushi.jpg', thumb: 'assets/events/aiko-sushi-sm.jpg', brand: 'aiko', 
      title: '[Sushi evening]', date: '[Month Year]', alt: 'Two pieces of gunkan sushi topped with roe' },
    { src: 'assets/events/capiche-fresh-pasta.jpg', thumb: 'assets/events/capiche-fresh-pasta-sm.jpg', brand: 'capiche', size: 'tall', 
      title: '[Fresh pasta class]', date: '[Month Year]', alt: 'Hands lifting freshly cut tagliatelle' },
    { src: 'assets/events/beshak-thali.jpg', thumb: 'assets/events/beshak-thali-sm.jpg', brand: 'beshak', 
      title: '[Festive thali lunch]', date: '[Month Year]', alt: 'An Indian thali with naan, curries and dips' },
    { src: 'assets/events/capiche-wood-fired-pizza.jpg', thumb: 'assets/events/capiche-wood-fired-pizza-sm.jpg', brand: 'capiche', 
      title: '[Wood-fired pizza night]', date: '[Month Year]', alt: 'A pizza on a peel in a glowing wood-fired oven' },
    { src: 'assets/events/aiko-korean-bbq.jpg', thumb: 'assets/events/aiko-korean-bbq-sm.jpg', brand: 'aiko', size: 'wide', 
      title: '[Korean BBQ night]', date: '[Month Year]', alt: 'A Korean BBQ spread with grill, meat, greens and kimchi' },
    { src: 'assets/events/aiko-ramen.jpg', thumb: 'assets/events/aiko-ramen-sm.jpg', brand: 'aiko', 
      title: '[Ramen night]', date: '[Month Year]', alt: 'A bowl of ramen with egg, scallions and chopsticks' },
    { src: 'assets/events/capiche-pizzaiolo.jpg', thumb: 'assets/events/capiche-pizzaiolo-sm.jpg', brand: 'capiche', size: 'tall', 
      title: '[Meet the pizzaiolo]', date: '[Month Year]', alt: 'A chef topping a pizza in an open kitchen' },
    { src: 'assets/events/beshak-mithai.jpg', thumb: 'assets/events/beshak-mithai-sm.jpg', brand: 'beshak', size: 'tall', 
      title: '[Mithai & celebrations]', date: '[Month Year]', alt: 'A platter of Indian sweets held by a woman in festive dress' },
    { src: 'assets/events/beshak-biryani.jpg', thumb: 'assets/events/beshak-biryani-sm.jpg', brand: 'beshak', 
      title: '[Biryani supper club]', date: '[Month Year]', alt: 'A bowl of biryani topped with crispy onions' },
    { src: 'assets/events/aiko-ramen-bar.jpg', thumb: 'assets/events/aiko-ramen-bar-sm.jpg', brand: 'aiko', size: 'wide', 
      title: '[Noodle bar takeover]', date: '[Month Year]', alt: 'Noodles lifted from a bowl of ramen at a restaurant table' },
    { src: 'assets/events/capiche-aperitivo.jpg', thumb: 'assets/events/capiche-aperitivo-sm.jpg', brand: 'capiche', 
      title: '[Aperitivo with friends]', date: '[Month Year]', alt: 'Friends raising a toast over pizza' },
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
      const file = large ? ev.src : (ev.thumb || ev.src);
      return `<img src="${file}" alt="${ev.alt || `${ev.title}, ${BRANDS[ev.brand].name}`}"${large ? '' : ' loading="lazy" decoding="async"'}>`;
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

/* ==========================================================================
   Bookends Hospitality: the menu viewer
   A button with data-menu="aiko" opens that brand's menus in a full-screen
   reader: one tab per menu, its pages as images (tap a page to zoom), and
   the original PDF to download. A menu with spread: true shows its pages
   side by side (fitted to the screen); otherwise they're stacked.

   To add a brand's menus: put the PDFs in assets/menue/<Brand>/, render each
   page to assets/menue/<Brand>/pages/ (WebP, ~2000px on the long side), add an
   entry below, and give that brand's card button data-menu="<brand>".
   ratio is a page's width / height; give a list when the pages differ.
   ========================================================================== */
(() => {
  'use strict';

  const MENUS = {
    aiko: {
      name: 'Aiko',
      logo: 'assets/aiko.png',
      menus: [
        {
          title: 'Food',
          pdf: 'assets/menue/Aiko/Aiko_Menu_Food.pdf',
          size: '1.8 MB',
          pages: ['assets/menue/Aiko/pages/food-1.webp', 'assets/menue/Aiko/pages/food-2.webp'],
          ratio: 1414 / 1999,
        },
        {
          title: 'Drinks',
          pdf: 'assets/menue/Aiko/Aiko_Drinks_Menu.pdf',
          size: '1 MB',
          pages: ['assets/menue/Aiko/pages/drinks-1.webp', 'assets/menue/Aiko/pages/drinks-2.webp'],
          ratio: 848 / 1800,
          spread: true,     // both pages side by side, like an open card
        },
        {
          title: 'Chumma Chinese',
          pdf: 'assets/menue/Aiko/Chumma%20Chinese.pdf',
          size: '10.8 MB',
          pages: ['assets/menue/Aiko/pages/chumma-chinese-1.webp', 'assets/menue/Aiko/pages/chumma-chinese-2.webp'],
          ratio: 1021 / 1800,
          spread: true,
        },
      ],
    },
    beshak: {
      name: 'Beshak',
      logo: 'assets/tiger.png',
      wideLogo: true,
      menus: [
        {
          title: 'Food & drinks',
          file: 'Food and drinks',
          pdf: 'assets/menue/Beshak/Beshak%20New.pdf',
          size: '7.2 MB',
          pages: ['assets/menue/Beshak/pages/menu-1.webp', 'assets/menue/Beshak/pages/menu-2.webp'],
          ratio: 1414 / 2000,
        },
      ],
    },
    capiche: {
      name: 'Capiche',
      logo: 'assets/capiche.png',
      menus: [
        {
          title: 'Food',
          pdf: 'assets/menue/Capiche/Capiche_Menu.pdf',
          size: '4.5 MB',
          pages: [
              'assets/menue/Capiche/pages/food-1.webp',
              'assets/menue/Capiche/pages/food-2.webp',
            ],
          ratio: 1999 / 1414,
        },
        {
          title: 'Drinks · Surat',
          file: 'Drinks Surat',
          pdf: 'assets/menue/Capiche/Capiche%20Surat.pdf',
          size: '1.5 MB',
          pages: [
              'assets/menue/Capiche/pages/drinks-surat-1.webp',
              'assets/menue/Capiche/pages/drinks-surat-2.webp',
            ],
          ratio: 848 / 1800,
          spread: true,
        },
        {
          title: 'Drinks · Ahmedabad',
          file: 'Drinks Ahmedabad',
          pdf: 'assets/menue/Capiche/Capiche%20AHM%20Final.pdf',
          size: '3.9 MB',
          pages: [
              'assets/menue/Capiche/pages/drinks-ahmedabad-1.webp',
              'assets/menue/Capiche/pages/drinks-ahmedabad-2.webp',
              'assets/menue/Capiche/pages/drinks-ahmedabad-3.webp',
              'assets/menue/Capiche/pages/drinks-ahmedabad-4.webp',
            ],
          ratio: 848 / 1800,
          spread: true,
        },
        {
          title: 'Breakfast · Uni',
          file: 'Breakfast Uni',
          pdf: 'assets/menue/Capiche/Capiche_Menu_Breakfat_uni.pdf',
          size: '1.1 MB',
          pages: [
              'assets/menue/Capiche/pages/breakfast-uni-1.webp',
              'assets/menue/Capiche/pages/breakfast-uni-2.webp',
            ],
          ratio: 1273 / 1800,
          spread: true,
        },
        {
          title: 'Cakes',
          pdf: 'assets/menue/Capiche/Cake%20Menu.pdf',
          size: '34 MB',
          pages: [
              'assets/menue/Capiche/pages/cakes-1.webp',
              'assets/menue/Capiche/pages/cakes-2.webp',
              'assets/menue/Capiche/pages/cakes-3.webp',
              'assets/menue/Capiche/pages/cakes-4.webp',
              'assets/menue/Capiche/pages/cakes-5.webp',
              'assets/menue/Capiche/pages/cakes-6.webp',
              'assets/menue/Capiche/pages/cakes-7.webp',
              'assets/menue/Capiche/pages/cakes-8.webp',
              'assets/menue/Capiche/pages/cakes-9.webp',
            ],
          // one ratio per page: page 5 (the glossary title) is a short strip
          ratio: [
              1272 / 1800,
              1272 / 1800,
              1272 / 1800,
              1272 / 1800,
              1800 / 729,
              1272 / 1800,
              1272 / 1800,
              1272 / 1800,
              1272 / 1800,
            ],
        },
      ],
    },
  };

  const box = document.getElementById('menu-viewer');
  const openers = [...document.querySelectorAll('[data-menu]')];
  if (!box || !openers.length) return;

  const logo = box.querySelector('.mv__logo');
  const brandName = box.querySelector('.mv__brand');
  const tabs = box.querySelector('.mv__tabs');
  const pagesEl = box.querySelector('.mv__pages');
  const download = box.querySelector('.mv__download');
  let current = null;
  let opener = null;
  let showing = 0;              // which showMenu call is current (a tab change makes older ones stale)

  /* --- fast loading ----------------------------------------------------------
     Every page exists in three sizes: name.400.webp, name.640.webp and name.webp
     (full, ~1400–2000px). The viewer shows the smallest that looks sharp on the
     screen, and loads the full one only when a page is zoomed. Menus are also
     fetched ahead: the first menu of each brand once the brand cards are in
     view or a View menu button is touched, and the other tabs as soon as a
     menu has opened. Nothing is fetched ahead when the visitor saves data. */
  const phone = () => window.innerWidth <= 600;
  const sized = (src, w) => (w ? src.replace(/\.webp$/, `.${w}.webp`) : src);
  const sizeFor = (menu) => (menu.spread ? (phone() ? 400 : 640) : (phone() ? 640 : 0));   // 0 = full
  const onFirstScreen = (menu) => (menu.spread ? 4 : 2);
  const firstScreen = (menu) => menu.pages.slice(0, onFirstScreen(menu)).map((p) => sized(p, sizeFor(menu)));
  const conn = navigator.connection || {};
  const thrifty = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  const fetched = new Map();     // url → { img, done }
  function prefetch(urls) {
    return Promise.all(urls.map((u) => {
      if (!fetched.has(u)) {
        const img = new Image();
        img.decoding = 'async';
        img.src = u;
        fetched.set(u, { img, done: (img.decode ? img.decode() : Promise.resolve()).catch(() => {}) });
      }
      return fetched.get(u).done;
    }));
  }
  // stop fetching ahead whatever isn't needed now (keeps the line clear for the menu being opened)
  function cancelPrefetch(keep) {
    fetched.forEach(({ img }, u) => {
      if (!img.complete && !keep.includes(u)) {
        img.src = '';
        fetched.delete(u);
      }
    });
  }
  const prefetchMenu = (brand, i = 0) => {
    const m = MENUS[brand] && MENUS[brand].menus[i];
    return m && !thrifty ? prefetch(firstScreen(m)) : Promise.resolve();
  };
  // once a menu is open: the other tabs' first pages, one after another
  async function prefetchOtherTabs() {
    const brand = current;
    for (let i = 1; i < brand.menus.length; i++) {
      if (current !== brand || thrifty) return;
      await prefetch(firstScreen(brand.menus[i]));
    }
  }

  function showMenu(i) {
    const menu = current.menus[i];
    [...tabs.children].forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    const ratio = (k) => (Array.isArray(menu.ratio) ? menu.ratio[k] : menu.ratio);
    const size = sizeFor(menu);
    const first = onFirstScreen(menu);
    pagesEl.innerHTML = menu.pages.map((src, k) => `
      <figure class="mv__page" style="--ratio: ${ratio(k)}">
        <button class="mv__zoom" type="button" title="Tap to zoom" aria-label="Zoom page ${k + 1} of ${menu.pages.length}" aria-pressed="false">
          <img ${k < first ? 'src' : 'data-src'}="${sized(src, size)}" data-full="${src}" alt="${current.name} ${menu.title} menu, page ${k + 1} of ${menu.pages.length}" ${k >= first ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">
        </button>
        <figcaption>Page ${k + 1} of ${menu.pages.length}</figcaption>
      </figure>`).join('');
    pagesEl.classList.toggle('mv__pages--spread', !!menu.spread);
    pagesEl.scrollTop = 0;
    // the rest of the pages start only once the first screen is sharp, so they don't
    // compete with it for the connection (the browser's own lazy loading reaches far ahead)
    const shown = ++showing;
    const imgs = [...pagesEl.querySelectorAll('img')];
    Promise.all(imgs.slice(0, first).map((im) => (im.decode ? im.decode() : Promise.resolve()).catch(() => {})))
      .then(() => {
        if (shown !== showing) return;
        imgs.slice(first).forEach((im) => { im.src = im.dataset.src; });
      });
    pagesEl.setAttribute('aria-labelledby', tabs.children[i].id);
    const label = `Download the ${current.name} ${menu.title} menu (PDF, ${menu.size})`;
    download.href = menu.pdf;
    download.setAttribute('download', `${current.name} ${menu.file || menu.title} menu.pdf`);
    download.setAttribute('aria-label', label);
    download.title = label;
  }

  function open(brand, from) {
    current = MENUS[brand];
    if (!current) return;
    opener = from;
    const several = current.menus.length > 1;
    logo.src = current.logo;
    logo.classList.toggle('is-wide', !!current.wideLogo);
    brandName.textContent = several ? `${current.name} menus` : `${current.name} menu`;
    tabs.hidden = !several;          // one menu: no tabs to choose between
    tabs.innerHTML = current.menus.map((m, i) =>
      `<button type="button" role="tab" id="mv-tab-${i}" aria-controls="mv-pages">${m.title}</button>`).join('');
    cancelPrefetch(firstScreen(current.menus[0]));
    showMenu(0);
    box.showModal();
    prefetch(firstScreen(current.menus[0])).then(prefetchOtherTabs);
    document.documentElement.classList.add('is-locked');
    (several ? tabs.children[0] : box.querySelector('.mv__close')).focus();
  }

  openers.forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      open(b.dataset.menu, b);
    });
    ['pointerenter', 'touchstart', 'focus'].forEach((type) =>
      b.addEventListener(type, () => prefetchMenu(b.dataset.menu), { passive: true, once: true }));
  });
  tabs.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[role="tab"]');
    if (t && current) prefetch(firstScreen(current.menus[[...tabs.children].indexOf(t)]));
  });

  // the brand cards come into view: fetch each brand's first menu ahead, when the browser is idle
  const cards = document.getElementById('brands');
  if (cards && 'IntersectionObserver' in window && !thrifty) {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
      idle(() => openers.reduce((p, b) => p.then(() => prefetchMenu(b.dataset.menu)), Promise.resolve()));
    }, { rootMargin: '400px 0px' });
    io.observe(cards);
  }

  // tabs: click, or arrow keys between them
  tabs.addEventListener('click', (e) => {
    const t = e.target.closest('[role="tab"]');
    if (!t) return;
    const i = [...tabs.children].indexOf(t);
    cancelPrefetch(firstScreen(current.menus[i]));
    showMenu(i);
    prefetchOtherTabs();
  });
  tabs.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const all = [...tabs.children];
    const i = all.indexOf(document.activeElement);
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length;
    showMenu(next);
    all[next].focus();
  });

  // tap a page to zoom in (read the small print); tap again to fit
  pagesEl.addEventListener('click', (e) => {
    const z = e.target.closest('.mv__zoom');
    if (!z) return;
    const on = z.getAttribute('aria-pressed') !== 'true';
    z.setAttribute('aria-pressed', String(on));
    z.closest('.mv__page').classList.toggle('is-zoomed', on);
    const img = z.querySelector('img');
    if (on && img.dataset.full && img.currentSrc.indexOf(img.dataset.full) === -1) {
      const full = img.dataset.full;
      prefetch([full]).then(() => { img.src = full; });
    }
    if (on && !pagesEl.classList.contains('mv__pages--spread')) {
      // keep the spot that was tapped under the finger
      const r = z.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width;
      requestAnimationFrame(() => { z.scrollLeft = fx * z.scrollWidth - z.clientWidth / 2; });
    }
  });

  box.querySelector('.mv__close').addEventListener('click', () => box.close());
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });   // the backdrop
  box.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    pagesEl.innerHTML = '';
    if (opener) opener.focus();
  });
})();

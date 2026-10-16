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

  function showMenu(i) {
    const menu = current.menus[i];
    [...tabs.children].forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    const ratio = (k) => (Array.isArray(menu.ratio) ? menu.ratio[k] : menu.ratio);
    pagesEl.innerHTML = menu.pages.map((src, k) => `
      <figure class="mv__page" style="--ratio: ${ratio(k)}">
        <button class="mv__zoom" type="button" title="Tap to zoom" aria-label="Zoom page ${k + 1} of ${menu.pages.length}" aria-pressed="false">
          <img src="${src}" alt="${current.name} ${menu.title} menu, page ${k + 1} of ${menu.pages.length}" ${k ? 'loading="lazy"' : ''} decoding="async">
        </button>
        <figcaption>Page ${k + 1} of ${menu.pages.length}</figcaption>
      </figure>`).join('');
    pagesEl.classList.toggle('mv__pages--spread', !!menu.spread);
    pagesEl.scrollTop = 0;
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
    showMenu(0);
    box.showModal();
    document.documentElement.classList.add('is-locked');
    (several ? tabs.children[0] : box.querySelector('.mv__close')).focus();
  }

  openers.forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    open(b.dataset.menu, b);
  }));

  // tabs: click, or arrow keys between them
  tabs.addEventListener('click', (e) => {
    const t = e.target.closest('[role="tab"]');
    if (t) showMenu([...tabs.children].indexOf(t));
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

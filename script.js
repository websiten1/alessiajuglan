/* =========================================================
   Alessia Juglan — shared site scripts
   Handles: shared nav/footer, preloader, animations, menu,
   cursor, scroll progress, reveals, text splits, magnetic,
   parallax, tabs, hours, faq, smooth-scroll.
   ========================================================= */
(() => {
  'use strict';

  // ---------- Data ----------
  const PHONE = '0757051148';
  const PHONE_INTL = '40757051148'; // without leading 0, with RO country code
  const EMAIL = 'alessiaj_74@yahoo.com';
  const INSTAGRAM = 'https://www.instagram.com/alessiajuglan';
  const TIKTOK = 'https://www.tiktok.com/@alessiajuglan';

  window.AJ = window.AJ || {};
  window.AJ.PHONE = PHONE;
  window.AJ.PHONE_INTL = PHONE_INTL;
  window.AJ.EMAIL = EMAIL;
  window.AJ.INSTAGRAM = INSTAGRAM;
  window.AJ.TIKTOK = TIKTOK;

  // ---------- Build shared header/footer ----------
  function currentPage() {
    const path = location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  function buildNav() {
    const page = currentPage();
    const links = [
      { href: 'index.html', label: 'Acasă' },
      { href: 'despre.html', label: 'Despre' },
      { href: 'servicii.html', label: 'Servicii' },
      { href: 'galerie.html', label: 'Galerie' },
      { href: 'recenzii.html', label: 'Recenzii' },
      { href: 'contact.html', label: 'Contact' },
    ];
    const linksHtml = links.map((l) => {
      const active = (page === l.href || (page === '' && l.href === 'index.html')) ? ' class="is-active"' : '';
      return `<a href="${l.href}"${active}>${l.label}</a>`;
    }).join('');
    const mobileHtml = links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('');

    return `
      <header class="nav" id="nav">
        <div class="nav__inner">
          <a href="index.html" class="nav__logo" aria-label="Alessia Juglan">
            <span class="nav__logo-mark"><span>A<span class="amp">·</span>J</span></span>
            <span class="nav__logo-text">Alessia Juglan</span>
          </a>
          <nav class="nav__links" aria-label="Meniu principal">${linksHtml}</nav>
          <a href="programare.html" class="btn btn--gold nav__cta" data-magnetic>
            <span>Programează-te</span>
          </a>
          <button class="nav__burger" aria-label="Deschide meniul" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
        <div class="nav__mobile" aria-hidden="true">
          ${mobileHtml}
          <a href="programare.html" class="btn btn--gold">Programează-te</a>
        </div>
      </header>`;
  }

  function buildFooter() {
    return `
      <footer class="footer">
        <div class="container footer__inner">
          <div class="footer__brand">
            <span class="footer__mark">A<span class="amp">·</span>J</span>
            <p>Alessia Juglan Nail Artist — Manichiură premium în Iași, cu atentie la detaliu și produse de top.</p>
          </div>
          <div class="footer__links">
            <a href="index.html">Acasă</a>
            <a href="despre.html">Despre</a>
            <a href="servicii.html">Servicii</a>
            <a href="galerie.html">Galerie</a>
            <a href="recenzii.html">Recenzii</a>
            <a href="programare.html">Programare</a>
            <a href="contact.html">Contact</a>
          </div>
          <div class="footer__meta">
            <span>© <span id="year"></span> Alessia Juglan. Toate drepturile rezervate.</span>
            <span>Design & dezvoltare de <a href="#">studio</a></span>
          </div>
        </div>
      </footer>`;
  }

  // Inject nav/footer if placeholders exist
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.outerHTML = buildNav();
  if (footerSlot) footerSlot.outerHTML = buildFooter();

  // ---------- Preloader ----------
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('is-done'), 400);
    });
    setTimeout(() => preloader.classList.add('is-done'), 2200); // fallback
  }

  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Nav scrolled + progress bar ----------
  const nav = document.getElementById('nav');
  const progress = document.querySelector('.scroll-progress');
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
    if (progress) {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + '%';
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Mobile menu ----------
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');
  if (burger && mobile) {
    const toggle = (open) => {
      const isOpen = open ?? !burger.classList.contains('is-open');
      burger.classList.toggle('is-open', isOpen);
      mobile.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      mobile.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  }

  // (custom cursor removed by design)

  // ---------- Intersection Observer for reveals ----------
  const revealSelector = '.reveal, .reveal-x, .reveal-scale, .reveal-clip, .split-line, .split-words, [data-stagger], .process__line';
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view', 'in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll(revealSelector).forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(revealSelector).forEach((el) => el.classList.add('in-view', 'in'));
  }

  // ---------- Split text helpers ----------
  document.querySelectorAll('[data-split="words"]').forEach((el) => {
    if (el.dataset.splitDone) return;
    const text = el.textContent.trim();
    const words = text.split(' ');
    el.innerHTML = words.map((w, i) => `<span class="word"><span style="--i:${i}">${w}</span></span>`).join(' ');
    el.classList.add('split-words');
    el.dataset.splitDone = '1';
  });

  // ---------- Magnetic buttons ----------
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.3;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ---------- Parallax data-parallax ----------
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  if (parallaxItems.length) {
    window.addEventListener('scroll', () => {
      parallaxItems.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.setProperty('--offset', `${-offset}px`);
        el.style.transform = `translateY(${-offset}px)`;
      });
    }, { passive: true });
  }

  // ---------- Counter ----------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const end = parseFloat(el.dataset.count);
        const dur = parseInt(el.dataset.dur || '1600', 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const val = end * ease;
          el.textContent = prefix + val.toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  }

  // ---------- Service tabs ----------
  const tabs = document.querySelectorAll('.service-tab');
  if (tabs.length) {
    const cards = document.querySelectorAll('.service');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const cat = tab.dataset.tab;
        cards.forEach((c) => {
          const show = cat === 'all' || c.dataset.cat === cat;
          c.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  // ---------- Gallery filter ----------
  const galleryTabs = document.querySelectorAll('[data-gallery-tab]');
  if (galleryTabs.length) {
    const gItems = document.querySelectorAll('.gallery__item[data-cat]');
    galleryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        galleryTabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const cat = tab.dataset.galleryTab;
        gItems.forEach((g) => {
          const match = cat === 'all' || g.dataset.cat === cat;
          g.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq__item').forEach((item) => {
    const btn = item.querySelector('.faq__q');
    const ans = item.querySelector('.faq__a');
    if (!btn || !ans) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      ans.style.maxHeight = open ? ans.scrollHeight + 40 + 'px' : '0';
    });
  });

  // ---------- Hours / open status ----------
  // Schedule: 0=Sun..6=Sat, [open, close] in hours (24)
  const schedule = {
    0: null, 1: [12, 20], 2: [10, 18], 3: [12, 20],
    4: [10, 18], 5: [10, 18], 6: null,
  };
  window.AJ.schedule = schedule;

  const openEl = document.querySelector('[data-open]');
  const hoursItems = document.querySelectorAll('[data-day]');
  if (hoursItems.length) {
    const now = new Date();
    const day = now.getDay();
    hoursItems.forEach((li) => {
      if (Number(li.dataset.day) === day) li.classList.add('today');
    });
    if (openEl) {
      const hour = now.getHours() + now.getMinutes() / 60;
      const today = schedule[day];
      if (today && hour >= today[0] && hour < today[1]) {
        openEl.textContent = 'Deschis acum';
        openEl.classList.add('is-open');
      } else {
        openEl.textContent = 'Închis';
        openEl.classList.add('is-closed');
      }
    }
  }

  // ---------- Smooth scroll w/ offset ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- Contact form (mailto / wa fallback) ----------
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm).entries());
      const msg = [
        'Bună, Alessia!',
        '',
        `Numele meu este ${data.name || '—'}.`,
        `Telefon: ${data.phone || '—'}`,
        data.email ? `Email: ${data.email}` : '',
        '',
        'Mesaj:',
        data.message || '—',
      ].filter(Boolean).join('\n');
      const waUrl = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener');

      // visual feedback
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Mesaj trimis prin WhatsApp';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          contactForm.reset();
        }, 2600);
      }
    });
  }
})();

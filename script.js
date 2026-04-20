(() => {
  'use strict';

  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Nav scrolled state ----------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
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

  // ---------- Cursor glow ----------
  const glow = document.querySelector('.cursor-glow');
  if (glow && matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const animate = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  // ---------- Reveal on scroll ----------
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    : null;

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    if (io) io.observe(el);
    else el.classList.add('in-view');
  });

  // ---------- Service tabs ----------
  const tabs = document.querySelectorAll('.service-tab');
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

  // ---------- Hours / open status ----------
  const openEl = document.querySelector('[data-open]');
  const hoursItems = document.querySelectorAll('.contact__hours li');
  const schedule = {
    0: null,              // Sunday
    1: [12, 20],          // Monday
    2: [10, 18],          // Tuesday
    3: [12, 20],          // Wednesday
    4: [10, 18],          // Thursday
    5: [10, 18],          // Friday
    6: null,              // Saturday
  };
  if (openEl) {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;
    const today = schedule[day];
    hoursItems.forEach((li) => {
      if (Number(li.dataset.day) === day) li.classList.add('today');
    });
    if (today && hour >= today[0] && hour < today[1]) {
      openEl.textContent = 'Deschis acum';
      openEl.classList.add('is-open');
    } else {
      openEl.textContent = 'Închis';
      openEl.classList.add('is-closed');
    }
  }

  // ---------- Smooth scroll offset for fixed nav ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

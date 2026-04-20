/* =========================================================
   Alessia Juglan — Booking flow
   5 steps: service → date → time → form → review → success
   No backend: final submit opens WhatsApp with full details.
   ========================================================= */
(() => {
  'use strict';

  const services = window.AJ?.services || [];
  const schedule = window.AJ?.schedule || {};
  const PHONE_INTL = window.AJ?.PHONE_INTL || '40757051148';

  const MONTHS = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
  const DAYS_RO = ['Duminică','Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă'];

  const state = {
    step: 1,
    service: null,
    date: null,       // Date object
    time: null,       // '14:30'
    name: '', phone: '', email: '', notes: '',
    calMonth: new Date().getMonth(),
    calYear: new Date().getFullYear(),
  };

  // ---------- Render service list ----------
  const listEl = document.getElementById('book-services');
  function renderServices() {
    if (!listEl) return;
    listEl.innerHTML = services.map((s) => `
      <div class="book-service" data-id="${s.id}">
        <span class="book-service__radio"></span>
        <div class="book-service__info">
          <h4>${s.shortTitle}</h4>
          <p>${s.desc}</p>
        </div>
        <span class="book-service__time">${s.durationLabel}</span>
        <span class="book-service__price">${s.priceLabel} <i>RON</i></span>
      </div>
    `).join('');
    listEl.querySelectorAll('.book-service').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        state.service = services.find((s) => s.id === id) || null;
        listEl.querySelectorAll('.book-service').forEach((x) => x.classList.toggle('is-selected', x === el));
        updateSummary();
      });
    });
  }

  // Preselect from ?service=xxx
  function preselectFromQuery() {
    const qs = new URLSearchParams(location.search);
    const id = qs.get('service');
    if (!id) return;
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    state.service = svc;
    const el = listEl?.querySelector(`.book-service[data-id="${id}"]`);
    if (el) el.classList.add('is-selected');
    updateSummary();
  }

  // ---------- Calendar ----------
  const calTitle = document.getElementById('cal-title');
  const calGrid = document.getElementById('cal-grid');
  const calPrev = document.getElementById('cal-prev');
  const calNext = document.getElementById('cal-next');

  function isDateSelectable(d) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tgt = new Date(d);
    tgt.setHours(0, 0, 0, 0);
    if (tgt < today) return false;
    const day = tgt.getDay();
    if (!schedule[day]) return false;
    return true;
  }

  function renderCalendar() {
    if (!calGrid || !calTitle) return;
    calTitle.textContent = `${MONTHS[state.calMonth]} ${state.calYear}`;

    const first = new Date(state.calYear, state.calMonth, 1);
    const firstWeekday = (first.getDay() + 6) % 7; // convert Sun=0 to last (0..6 where 0=Mon)
    const daysInMonth = new Date(state.calYear, state.calMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(`<div class="calendar__cell is-empty"></div>`);
    const today = new Date();
    today.setHours(0,0,0,0);
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(state.calYear, state.calMonth, d);
      const selectable = isDateSelectable(dt);
      const classes = ['calendar__cell'];
      if (!selectable) classes.push('is-disabled');
      if (dt.getTime() === today.getTime()) classes.push('is-today');
      if (state.date && dt.getTime() === new Date(state.date).setHours(0,0,0,0)) classes.push('is-selected');
      cells.push(`<div class="${classes.join(' ')}" data-date="${dt.toISOString()}">${d}</div>`);
    }
    calGrid.innerHTML = cells.join('');

    calGrid.querySelectorAll('.calendar__cell:not(.is-empty):not(.is-disabled)').forEach((cell) => {
      cell.addEventListener('click', () => {
        state.date = new Date(cell.dataset.date);
        state.time = null;
        renderCalendar();
        updateSummary();
      });
    });

    // Disable prev if we're on current month
    const now = new Date();
    const isCurrent = state.calYear === now.getFullYear() && state.calMonth === now.getMonth();
    if (calPrev) calPrev.disabled = isCurrent;
  }

  calPrev?.addEventListener('click', () => {
    state.calMonth--;
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
    renderCalendar();
  });
  calNext?.addEventListener('click', () => {
    state.calMonth++;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    renderCalendar();
  });

  // ---------- Time slots ----------
  const slotsEl = document.getElementById('time-slots');

  function formatMinutes(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function generateSlots() {
    if (!slotsEl || !state.date || !state.service) {
      if (slotsEl) slotsEl.innerHTML = `<p class="no-slots">Selectează mai întâi un serviciu și o dată.</p>`;
      return;
    }
    const day = state.date.getDay();
    const range = schedule[day];
    if (!range) {
      slotsEl.innerHTML = `<p class="no-slots">Ziua selectată nu are program.</p>`;
      return;
    }
    const [openH, closeH] = range;
    const openMin = openH * 60;
    const closeMin = closeH * 60;
    const duration = state.service.duration;
    const step = 30;

    const isToday = (() => {
      const t = new Date();
      return t.getFullYear() === state.date.getFullYear()
        && t.getMonth() === state.date.getMonth()
        && t.getDate() === state.date.getDate();
    })();
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

    const slots = [];
    for (let m = openMin; m + duration <= closeMin; m += step) {
      const disabled = isToday && m <= nowMin + 30;
      slots.push({ m, disabled });
    }
    if (!slots.length) {
      slotsEl.innerHTML = `<p class="no-slots">În această zi nu mai sunt intervale disponibile pentru serviciul ales.</p>`;
      return;
    }
    slotsEl.innerHTML = slots.map((s) => {
      const time = formatMinutes(s.m);
      const classes = ['time-slot'];
      if (s.disabled) classes.push('is-disabled');
      if (state.time === time) classes.push('is-selected');
      return `<div class="${classes.join(' ')}" data-time="${time}">${time}</div>`;
    }).join('');

    slotsEl.querySelectorAll('.time-slot:not(.is-disabled)').forEach((el) => {
      el.addEventListener('click', () => {
        state.time = el.dataset.time;
        slotsEl.querySelectorAll('.time-slot').forEach((x) => x.classList.toggle('is-selected', x === el));
        updateSummary();
      });
    });
  }

  // ---------- Summary ----------
  function formatDate(d) {
    if (!d) return '—';
    return `${DAYS_RO[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()].toLowerCase()} ${d.getFullYear()}`;
  }
  function updateSummary() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('sum-service', state.service ? state.service.shortTitle : '—');
    set('sum-duration', state.service ? state.service.durationLabel : '—');
    set('sum-date', state.date ? formatDate(state.date) : '—');
    set('sum-time', state.time ? state.time : '—');
    set('sum-price', state.service ? state.service.priceLabel : '—');
  }

  // ---------- Review block ----------
  function renderReview() {
    const el = document.getElementById('review-block');
    if (!el) return;
    el.innerHTML = `
      <h4>Programarea ta</h4>
      <div class="review-row"><span>Serviciu</span><strong>${state.service?.shortTitle || '—'}</strong></div>
      <div class="review-row"><span>Durată estimată</span><strong>${state.service?.durationLabel || '—'}</strong></div>
      <div class="review-row"><span>Data</span><strong>${formatDate(state.date)}</strong></div>
      <div class="review-row"><span>Ora</span><strong>${state.time || '—'}</strong></div>
      <div class="review-row"><span>Preț</span><strong>${state.service?.priceLabel || '—'} <em>RON</em></strong></div>
      <div class="review-row" style="margin-top:10px;padding-top:14px;border-top:1px solid var(--line)"><span>Nume</span><strong>${state.name || '—'}</strong></div>
      <div class="review-row"><span>Telefon</span><strong>${state.phone || '—'}</strong></div>
      ${state.email ? `<div class="review-row"><span>Email</span><strong>${state.email}</strong></div>` : ''}
      ${state.notes ? `<div class="review-row"><span>Mențiuni</span><strong style="text-align:right;max-width:60%">${state.notes}</strong></div>` : ''}
    `;
  }

  // ---------- Stepper / navigation ----------
  const stepper = document.getElementById('stepper');
  const panels = document.querySelectorAll('.booking__panel');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const actions = document.getElementById('booking-actions');

  function gotoStep(n) {
    state.step = n;
    panels.forEach((p) => p.classList.toggle('is-active', Number(p.dataset.panel) === n));
    if (stepper) {
      stepper.querySelectorAll('.stepper__item').forEach((el) => {
        const s = Number(el.dataset.step);
        el.classList.toggle('is-active', s === n);
        el.classList.toggle('is-done', s < n);
      });
    }
    // Buttons
    btnBack.disabled = n <= 1 || n === 6;
    if (n === 5) {
      btnNext.innerHTML = `Trimite pe WhatsApp <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;
    } else if (n === 6) {
      actions.style.display = 'none';
    } else {
      actions.style.display = '';
      btnNext.innerHTML = `Continuă <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>`;
    }
    // Scroll main panel into view
    const main = document.getElementById('booking-main');
    if (main) main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  btnBack?.addEventListener('click', () => {
    if (state.step > 1) gotoStep(state.step - 1);
  });

  btnNext?.addEventListener('click', () => {
    if (!validateStep(state.step)) return;
    if (state.step === 3) {
      // Moving to form
      gotoStep(4);
      return;
    }
    if (state.step === 2) { generateSlots(); gotoStep(3); return; }
    if (state.step === 4) { renderReview(); gotoStep(5); return; }
    if (state.step === 5) { submitBooking(); return; }
    gotoStep(state.step + 1);
  });

  function shake(el) {
    if (!el) return;
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)' },
    ], { duration: 420, easing: 'ease-in-out' });
  }

  function validateStep(n) {
    if (n === 1 && !state.service) {
      shake(listEl);
      return false;
    }
    if (n === 2 && !state.date) {
      shake(document.getElementById('calendar'));
      return false;
    }
    if (n === 3 && !state.time) {
      shake(slotsEl);
      return false;
    }
    if (n === 4) {
      const form = document.getElementById('book-form');
      const fields = form.querySelectorAll('.field');
      let ok = true;
      fields.forEach((f) => f.classList.remove('has-error'));
      const name = form.querySelector('#bk-name');
      const phone = form.querySelector('#bk-phone');
      const email = form.querySelector('#bk-email');
      const consent = form.querySelector('#bk-consent');

      if (!name.value.trim()) { name.closest('.field').classList.add('has-error'); ok = false; }
      if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 9) {
        phone.closest('.field').classList.add('has-error'); ok = false;
      }
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.field').classList.add('has-error'); ok = false;
      }
      if (!consent.checked) {
        consent.closest('.field').classList.add('has-error'); ok = false;
      }
      if (!ok) return false;

      state.name = name.value.trim();
      state.phone = phone.value.trim();
      state.email = email.value.trim();
      state.notes = form.querySelector('#bk-notes').value.trim();
    }
    return true;
  }

  // ---------- Submit ----------
  function submitBooking() {
    const lines = [
      '*Cerere programare — Alessia Juglan Nail Tech*',
      '',
      `*Serviciu:* ${state.service?.shortTitle || '—'}`,
      `*Durată estimată:* ${state.service?.durationLabel || '—'}`,
      `*Data:* ${formatDate(state.date)}`,
      `*Ora:* ${state.time}`,
      `*Preț estimat:* ${state.service?.priceLabel || '—'} RON`,
      '',
      `*Nume:* ${state.name}`,
      `*Telefon:* ${state.phone}`,
    ];
    if (state.email) lines.push(`*Email:* ${state.email}`);
    if (state.notes) {
      lines.push('');
      lines.push('*Mențiuni:*');
      lines.push(state.notes);
    }
    lines.push('');
    lines.push('Confirm că am citit regulamentul și aștept confirmarea din partea ta. Mulțumesc!');

    const msg = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${PHONE_INTL}?text=${msg}`;

    const w = window.open(url, '_blank', 'noopener');
    // Go to success regardless — user will close WA and return
    setTimeout(() => gotoStep(6), 250);
    if (!w) {
      // popup blocked fallback — same tab
      location.href = url;
    }
  }

  // ---------- New booking ----------
  document.getElementById('new-booking')?.addEventListener('click', () => {
    // reset state
    state.service = null;
    state.date = null;
    state.time = null;
    state.name = state.phone = state.email = state.notes = '';
    document.getElementById('book-form')?.reset();
    actions.style.display = '';
    listEl.querySelectorAll('.book-service').forEach((x) => x.classList.remove('is-selected'));
    updateSummary();
    renderCalendar();
    gotoStep(1);
  });

  // ---------- Init ----------
  renderServices();
  preselectFromQuery();
  renderCalendar();
  updateSummary();
})();

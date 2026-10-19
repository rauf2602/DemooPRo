/* ===== BronUz — demo logikasi =====
   Ma'lumotlar localStorage'da saqlanadi (faqat brauzerda).
   =================================== */

'use strict';

/* ---------- Xonalar ma'lumotlari ---------- */
const ROOMS = [
  {
    id: 'r1',
    name: 'Eko xona',
    emoji: '🌿',
    price: 180000,
    capacity: 1,
    size: 14,
    desc: 'Byudjet uchun qulay, yolg‘iz sayohatchilarga mo‘ljallangan xona.',
    gradient: 'linear-gradient(135deg, #22c55e, #0ea5e9)'
  },
  {
    id: 'r2',
    name: 'Standart xona',
    emoji: '🛏️',
    price: 250000,
    capacity: 2,
    size: 18,
    desc: 'Bir kishilik krovat, ish stoli, tez Wi-Fi va konditsioner.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
  {
    id: 'r3',
    name: 'Ikki kishilik lyuks',
    emoji: '🛋️',
    price: 450000,
    capacity: 2,
    size: 26,
    desc: 'Katta krovat, balkon va shahar manzarasi.',
    gradient: 'linear-gradient(135deg, #f97316, #ec4899)'
  },
  {
    id: 'r4',
    name: 'Oila xonasi',
    emoji: '👨‍👩‍👧',
    price: 600000,
    capacity: 4,
    size: 34,
    desc: 'Ikki xonali, bolalar uchun alohida joy va oshxona burchagi.',
    gradient: 'linear-gradient(135deg, #0ea5e9, #14b8a6)'
  },
  {
    id: 'r5',
    name: 'Biznes lyuks',
    emoji: '💼',
    price: 780000,
    capacity: 2,
    size: 30,
    desc: 'Ish uchrashuvlari uchun: tez internet, printer va minibar.',
    gradient: 'linear-gradient(135deg, #334155, #64748b)'
  },
  {
    id: 'r6',
    name: 'Prezident lyuks',
    emoji: '👑',
    price: 1500000,
    capacity: 4,
    size: 55,
    desc: 'Eng yuqori qavat, jakuzi, keng zal va shaxsiy xizmat.',
    gradient: 'linear-gradient(135deg, #a16207, #facc15)'
  }
];

/* ---------- Elementlar ---------- */
const els = {
  form: document.getElementById('searchForm'),
  checkIn: document.getElementById('checkIn'),
  checkOut: document.getElementById('checkOut'),
  guests: document.getElementById('guests'),
  searchNote: document.getElementById('searchNote'),
  rooms: document.getElementById('rooms'),
  roomCount: document.getElementById('roomCount'),
  emptyMsg: document.getElementById('emptyMsg'),
  bookings: document.getElementById('bookings'),
  myCount: document.getElementById('myCount'),
  clearAll: document.getElementById('clearAll'),
  modal: document.getElementById('modal'),
  modalBody: document.getElementById('modalBody'),
  modalClose: document.getElementById('modalClose'),
  toast: document.getElementById('toast')
};

/* ---------- Holat ---------- */
const state = {
  checkIn: '',
  checkOut: '',
  guests: 2
};

/* ---------- Yordamchi funksiyalar ---------- */

/** 250000 -> "250 000" */
const money = (n) => new Intl.NumberFormat('ru-RU').format(n);

/** "2026-10-19" -> "19.10.2026" */
function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** Bugungi sana YYYY-MM-DD ko‘rinishida */
function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Ikki sana orasidagi kechalar soni */
function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const start = new Date(a + 'T00:00:00');
  const end = new Date(b + 'T00:00:00');
  const diff = Math.round((end - start) / 86400000);
  return diff > 0 ? diff : 0;
}

/** Sanalar kesishadimi? (bron qilingan oraliq bilan) */
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { els.toast.hidden = true; }, 2400);
}

/* ---------- Saqlash / o‘qish ---------- */
function loadBookings() {
  try {
    const raw = localStorage.getItem('bronuz_bookings');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveBookings(list) {
  localStorage.setItem('bronuz_bookings', JSON.stringify(list));
}

/* ---------- Xona holati ---------- */
function isRoomBusy(roomId, checkIn, checkOut) {
  if (!checkIn || !checkOut) return false;
  return loadBookings().some((b) =>
    b.roomId === roomId && overlaps(checkIn, checkOut, b.checkIn, b.checkOut)
  );
}

/* ---------- Xonalarni ko‘rsatish ---------- */
function renderRooms() {
  const nights = nightsBetween(state.checkIn, state.checkOut);
  const guests = state.guests;

  const list = ROOMS.filter((r) => r.capacity >= guests);

  els.rooms.innerHTML = '';
  els.emptyMsg.hidden = list.length > 0;
  els.roomCount.textContent = nights
    ? `${list.length} ta xona • ${nights} kecha`
    : `${list.length} ta xona`;

  list.forEach((room) => {
    const busy = isRoomBusy(room.id, state.checkIn, state.checkOut);
    const total = room.price * nights;

    const card = document.createElement('article');
    card.className = 'room';
    card.innerHTML = `
      <div class="room-photo" style="background:${room.gradient}">
        <span>${room.emoji}</span>
        <span class="room-tag">${room.capacity} kishigacha</span>
      </div>
      <div class="room-body">
        <h3>${room.name}</h3>
        <div class="room-meta">
          <span>📐 ${room.size} m²</span>
          <span>👥 ${room.capacity} kishi</span>
        </div>
        <p class="room-desc">${room.desc}</p>
        <div class="room-price">
          <strong>${money(room.price)}</strong>
          <small>so‘m / kecha</small>
        </div>
        <div class="room-total">${nights ? `Jami: ${money(total)} so‘m (${nights} kecha)` : ''}</div>
        <button class="btn ${busy ? 'ghost' : 'primary'} block" data-room="${room.id}" ${busy ? 'disabled' : ''}>
          ${busy ? 'Bu sanalarda band' : 'Bron qilish'}
        </button>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => openBookingModal(room));
    els.rooms.appendChild(card);
  });
}

/* ---------- Bron oynasi (modal) ---------- */
function openModal(html) {
  els.modalBody.innerHTML = html;
  els.modal.hidden = false;
}

function closeModal() {
  els.modal.hidden = true;
  els.modalBody.innerHTML = '';
}

function openBookingModal(room) {
  const nights = nightsBetween(state.checkIn, state.checkOut);

  if (!nights) {
    toast('Avval kelish va ketish sanasini tanlang');
    return;
  }

  const total = room.price * nights;

  openModal(`
    <h2>${room.emoji} ${room.name}</h2>
    <p class="muted">Ma’lumotlaringizni kiriting — bron darhol tasdiqlanadi.</p>

    <div class="summary">
      <div class="summary-row"><span>Kelish</span><span>${formatDate(state.checkIn)}</span></div>
      <div class="summary-row"><span>Ketish</span><span>${formatDate(state.checkOut)}</span></div>
      <div class="summary-row"><span>Kechalar</span><span>${nights} kecha</span></div>
      <div class="summary-row"><span>Mehmonlar</span><span>${state.guests} kishi</span></div>
      <div class="summary-row"><span>Kecha narxi</span><span>${money(room.price)} so‘m</span></div>
      <div class="summary-row total"><span>Jami</span><span>${money(total)} so‘m</span></div>
    </div>

    <form class="form-grid" id="bookingForm" novalidate>
      <label>
        <span>To‘liq ism</span>
        <input type="text" name="name" placeholder="Masalan: Aziz Karimov" required>
      </label>
      <label>
        <span>Telefon raqam</span>
        <input type="tel" name="phone" placeholder="+998 90 123 45 67" required>
      </label>
      <label>
        <span>Email (ixtiyoriy)</span>
        <input type="email" name="email" placeholder="aziz@mail.uz">
      </label>
      <p class="form-error" id="formError"></p>
      <button type="submit" class="btn success block">Bronni tasdiqlash</button>
    </form>
  `);

  const form = document.getElementById('bookingForm');
  const errorEl = document.getElementById('formError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').trim();
    const phone = (data.get('phone') || '').trim();
    const email = (data.get('email') || '').trim();

    if (name.length < 3) {
      errorEl.textContent = 'Ism kamida 3 harfdan iborat bo‘lishi kerak.';
      return;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) {
      errorEl.textContent = 'Telefon raqam to‘liq kiritilmagan.';
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Email manzil noto‘g‘ri.';
      return;
    }

    if (isRoomBusy(room.id, state.checkIn, state.checkOut)) {
      errorEl.textContent = 'Afsus, bu xona hozirgina band qilindi. Boshqa xonani tanlang.';
      return;
    }

    const booking = {
      id: 'BR-' + Date.now().toString(36).toUpperCase().slice(-6),
      roomId: room.id,
      roomName: room.name,
      roomEmoji: room.emoji,
      checkIn: state.checkIn,
      checkOut: state.checkOut,
      nights,
      guests: state.guests,
      total,
      name,
      phone,
      email,
      createdAt: new Date().toISOString()
    };

    const all = loadBookings();
    all.unshift(booking);
    saveBookings(all);

    renderBookings();
    renderRooms();
    showSuccess(booking);
  });
}

/* ---------- Muvaffaqiyat oynasi ---------- */
function showSuccess(b) {
  openModal(`
    <div class="success-icon">✅</div>
    <h2 style="text-align:center">Bron tasdiqlandi!</h2>
    <p class="success-text">Bron raqami: <b>${b.id}</b></p>

    <div class="summary">
      <div class="summary-row"><span>Xona</span><span>${b.roomEmoji} ${b.roomName}</span></div>
      <div class="summary-row"><span>Sanalar</span><span>${formatDate(b.checkIn)} — ${formatDate(b.checkOut)}</span></div>
      <div class="summary-row"><span>Kechalar</span><span>${b.nights} kecha</span></div>
      <div class="summary-row"><span>Mehmon</span><span>${b.name}</span></div>
      <div class="summary-row"><span>Telefon</span><span>${b.phone}</span></div>
      <div class="summary-row total"><span>To‘lov</span><span>${money(b.total)} so‘m</span></div>
    </div>

    <button class="btn primary block" id="successOk">Yopish</button>
  `);

  document.getElementById('successOk').addEventListener('click', () => {
    closeModal();
    document.getElementById('bronlarim').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- Bronlar ro‘yxati ---------- */
function renderBookings() {
  const all = loadBookings();
  els.myCount.textContent = all.length;
  els.clearAll.hidden = all.length === 0;

  if (!all.length) {
    els.bookings.innerHTML = `
      <p class="empty">Hozircha bronlar yo‘q. Yuqoridan xona tanlab bron qiling — shu yerda ko‘rinadi.</p>
    `;
    return;
  }

  els.bookings.innerHTML = '';

  all.forEach((b) => {
    const row = document.createElement('article');
    row.className = 'booking';
    row.innerHTML = `
      <div class="booking-emoji">${b.roomEmoji}</div>
      <div>
        <h3>${b.roomName}</h3>
        <div class="booking-info">
          <b>${formatDate(b.checkIn)} — ${formatDate(b.checkOut)}</b> • ${b.nights} kecha • ${b.guests} kishi<br>
          ${b.name} • ${b.phone}
        </div>
      </div>
      <div class="booking-side">
        <span class="booking-id">${b.id}</span>
        <div><b>${money(b.total)} so‘m</b></div>
        <button class="btn ghost small" data-cancel="${b.id}" style="margin-top:8px">Bekor qilish</button>
      </div>
    `;
    row.querySelector('[data-cancel]').addEventListener('click', () => cancelBooking(b.id));
    els.bookings.appendChild(row);
  });
}

function cancelBooking(id) {
  const list = loadBookings().filter((b) => b.id !== id);
  saveBookings(list);
  renderBookings();
  renderRooms();
  toast('Bron bekor qilindi');
}

/* ---------- Qidiruv formasi ---------- */
els.form.addEventListener('submit', (e) => {
  e.preventDefault();

  const checkIn = els.checkIn.value;
  const checkOut = els.checkOut.value;
  const guests = Number(els.guests.value);

  if (!checkIn || !checkOut) {
    els.searchNote.textContent = 'Iltimos, kelish va ketish sanasini tanlang.';
    return;
  }
  if (nightsBetween(checkIn, checkOut) < 1) {
    els.searchNote.textContent = 'Ketish sanasi kelish sanasidan keyin bo‘lishi kerak.';
    return;
  }

  state.checkIn = checkIn;
  state.checkOut = checkOut;
  state.guests = guests;

  const nights = nightsBetween(checkIn, checkOut);
  els.searchNote.textContent =
    `${formatDate(checkIn)} — ${formatDate(checkOut)} • ${nights} kecha • ${guests} kishi`;

  renderRooms();
  document.getElementById('xonalar').scrollIntoView({ behavior: 'smooth' });
});

/* ---------- Boshqa hodisalar ---------- */
els.modalClose.addEventListener('click', closeModal);
els.modal.addEventListener('click', (e) => {
  if (e.target === els.modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !els.modal.hidden) closeModal();
});

els.clearAll.addEventListener('click', () => {
  if (confirm('Barcha bronlarni o‘chirmoqchimisiz?')) {
    saveBookings([]);
    renderBookings();
    renderRooms();
    toast('Barcha bronlar o‘chirildi');
  }
});

/* ---------- Boshlash ---------- */
function init() {
  // standart sanalar: bugun va ertaga
  els.checkIn.min = todayISO();
  els.checkOut.min = todayISO(1);
  els.checkIn.value = todayISO();
  els.checkOut.value = todayISO(1);

  state.checkIn = els.checkIn.value;
  state.checkOut = els.checkOut.value;
  state.guests = Number(els.guests.value);

  els.searchNote.textContent =
    `${formatDate(state.checkIn)} — ${formatDate(state.checkOut)} • 1 kecha • ${state.guests} kishi`;

  renderRooms();
  renderBookings();
}

init();

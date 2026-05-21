/* ============================================
   K7 Movies — Reminder page
   - Reads booking from localStorage
   - Shows confirmation card
   - Live countdown updating every second
   - Generates contextual notifications
   ============================================ */

const booking = JSON.parse(localStorage.getItem('k7Booking'));
const bookingCard = document.getElementById('bookingCard');
const countdownEl = document.getElementById('countdown');
const notificationsEl = document.getElementById('notifications');

if (!booking) {
  // No booking yet — show empty state
  bookingCard.innerHTML = `
    <h2>No Booking Found</h2>
    <p style="color:var(--text-grey);margin-bottom:1.5rem;">
      You haven't booked a ticket yet. Head over to the catalog to book your first show.
    </p>
    <a href="catalog.html" class="btn">Browse Movies</a>
  `;
  countdownEl.style.display = 'none';
  notificationsEl.style.display = 'none';
} else {
  renderBooking();
  startCountdown();
}

// ---- Render confirmation card ----
function renderBooking() {
  const showDate = new Date(booking.showDate);
  const dateStr = showDate.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });

  bookingCard.innerHTML = `
    <h2>🎬 Booking Confirmed</h2>
    <div class="booking-details">
      <div class="detail-item">
        <div class="label">Movie</div>
        <div class="value">${booking.movie}</div>
      </div>
      <div class="detail-item">
        <div class="label">Date</div>
        <div class="value">${dateStr}</div>
      </div>
      <div class="detail-item">
        <div class="label">Show Time</div>
        <div class="value">${booking.showTime}</div>
      </div>
      <div class="detail-item">
        <div class="label">Seats</div>
        <div class="value">${booking.seats.join(', ')}</div>
      </div>
      <div class="detail-item">
        <div class="label">Language / Genre</div>
        <div class="value">${booking.language} • ${booking.genre}</div>
      </div>
      <div class="detail-item">
        <div class="label">Total Paid</div>
        <div class="value">₹${booking.total}</div>
      </div>
    </div>
  `;
}

// ---- Countdown updater (every second) ----
function startCountdown() {
  const target = new Date(booking.showDate).getTime();
  let timer;

  function update() {
    const diff = target - Date.now();

    if (diff <= 0) {
      countdownEl.innerHTML = `<h3>🎉 The show has started — enjoy the movie!</h3>`;
      renderNotifications(0);
      clearInterval(timer);
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `
      <h3>⏰ Your show starts in</h3>
      <div class="countdown-timer">
        <div class="time-unit"><span class="number">${String(days).padStart(2,'0')}</span><span class="label">Days</span></div>
        <div class="time-unit"><span class="number">${String(hours).padStart(2,'0')}</span><span class="label">Hours</span></div>
        <div class="time-unit"><span class="number">${String(minutes).padStart(2,'0')}</span><span class="label">Minutes</span></div>
        <div class="time-unit"><span class="number">${String(seconds).padStart(2,'0')}</span><span class="label">Seconds</span></div>
      </div>
    `;
    renderNotifications(diff);
  }

  update();
  timer = setInterval(update, 1000);
}

// ---- Contextual notifications based on time remaining ----
function renderNotifications(diff) {
  const hoursLeft = diff / (1000 * 60 * 60);
  const messages = [
    { icon: '✅', msg: `Booking confirmed for ${booking.movie}.`, time: 'Just now' }
  ];

  if (hoursLeft > 0 && hoursLeft <= 24) {
    messages.push({ icon: '📅', msg: 'Your show is within 24 hours — get ready!', time: 'Reminder' });
  }
  if (hoursLeft > 0 && hoursLeft <= 2) {
    messages.push({ icon: '🍿', msg: 'Your show starts in less than 2 hours. Time to head out!', time: 'Reminder' });
  }
  if (hoursLeft > 0 && hoursLeft <= 0.5) {
    messages.push({ icon: '🎬', msg: 'Almost time! Please arrive at the theatre soon.', time: 'Urgent' });
  }
  if (diff <= 0) {
    messages.push({ icon: '🎉', msg: 'Show has started — enjoy your movie!', time: 'Now' });
  }

  notificationsEl.innerHTML = `
    <h2 class="section-title">Notifications</h2>
    ${messages.map(m => `
      <div class="notification">
        <div class="icon">${m.icon}</div>
        <div>
          <div class="msg">${m.msg}</div>
          <div class="time">${m.time}</div>
        </div>
      </div>
    `).join('')}
  `;
}
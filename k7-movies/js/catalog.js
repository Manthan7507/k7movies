/* ============================================
   K7 Movies — Catalog page
   - Hardcoded movies array
   - Filtering by language / genre / search
   - Modal with show timings + seat picker
   - Save booking → localStorage → reminder.html
   ============================================ */

// ---- Movie data ----
const movies = [
  { id: 1, title: 'Ocean Horizon', language: 'English', genre: 'Action', duration: '2h 15m', rating: 8.5, price: 250,
    poster: 'https://placehold.co/300x420/0A2540/FFFFFF?text=Ocean+Horizon',
    description: 'An action-packed adventure on the high seas as a former navy captain races against time to prevent a global catastrophe.' },
  { id: 2, title: 'Midnight Whisper', language: 'English', genre: 'Thriller', duration: '1h 55m', rating: 7.8, price: 220,
    poster: 'https://placehold.co/300x420/1E5AA8/FFFFFF?text=Midnight+Whisper',
    description: 'A psychological thriller about a detective haunted by an unsolved case from her past.' },
  { id: 3, title: 'Stellar Dreams', language: 'English', genre: 'Sci-Fi', duration: '2h 30m', rating: 9.1, price: 300,
    poster: 'https://placehold.co/300x420/4A90E2/FFFFFF?text=Stellar+Dreams',
    description: 'Humanity\'s last hope rests on a daring journey to a distant galaxy in search of a new home.' },
  { id: 4, title: 'Chennai Express 2', language: 'Tamil', genre: 'Action', duration: '2h 20m', rating: 8.2, price: 250,
    poster: 'https://placehold.co/300x420/0A2540/FFFFFF?text=Chennai+Express',
    description: 'A high-octane sequel with breathtaking stunts and emotional drama set in the heart of Chennai.' },
  { id: 5, title: 'Love in Paris', language: 'Hindi', genre: 'Romance', duration: '2h 5m', rating: 7.5, price: 220,
    poster: 'https://placehold.co/300x420/1E5AA8/FFFFFF?text=Love+in+Paris',
    description: 'A beautifully crafted love story between two strangers who meet by chance in the city of light.' },
  { id: 6, title: 'The Last Laugh', language: 'English', genre: 'Comedy', duration: '1h 45m', rating: 7.9, price: 200,
    poster: 'https://placehold.co/300x420/4A90E2/FFFFFF?text=The+Last+Laugh',
    description: 'A hilarious comedy following three stand-up comedians as they hunt for the world\'s funniest joke.' },
  { id: 7, title: 'Vetri Maaran', language: 'Tamil', genre: 'Drama', duration: '2h 40m', rating: 9.0, price: 280,
    poster: 'https://placehold.co/300x420/0A2540/FFFFFF?text=Vetri+Maaran',
    description: 'A powerful drama exploring the lives of three generations and their fight for justice.' },
  { id: 8, title: 'Pathshaala', language: 'Hindi', genre: 'Drama', duration: '2h 10m', rating: 8.3, price: 250,
    poster: 'https://placehold.co/300x420/1E5AA8/FFFFFF?text=Pathshaala',
    description: 'A heartwarming tale of a teacher who transforms an entire village through the power of education.' },
  { id: 9, title: 'Galactic Wars', language: 'English', genre: 'Sci-Fi', duration: '2h 25m', rating: 8.7, price: 300,
    poster: 'https://placehold.co/300x420/4A90E2/FFFFFF?text=Galactic+Wars',
    description: 'Epic space opera with stunning visuals and an unforgettable battle for the fate of the universe.' },
  { id: 10, title: 'Silent Echo', language: 'English', genre: 'Thriller', duration: '1h 50m', rating: 8.0, price: 220,
    poster: 'https://placehold.co/300x420/0A2540/FFFFFF?text=Silent+Echo',
    description: 'A gripping thriller about a deaf woman who witnesses a crime no one else can hear.' },
  { id: 11, title: 'Kadhal Theevu', language: 'Tamil', genre: 'Romance', duration: '2h 15m', rating: 7.6, price: 230,
    poster: 'https://placehold.co/300x420/1E5AA8/FFFFFF?text=Kadhal+Theevu',
    description: 'Two strangers stranded on an island discover love amid the chaos of survival.' },
  { id: 12, title: 'Hasya Bazaar', language: 'Hindi', genre: 'Comedy', duration: '1h 55m', rating: 7.7, price: 200,
    poster: 'https://placehold.co/300x420/4A90E2/FFFFFF?text=Hasya+Bazaar',
    description: 'A laugh riot in the bustling streets of Mumbai featuring a hilarious comedy of errors.' }
];

// ---- State ----
let selectedMovie = null;
let selectedTime = null;
let selectedSeats = [];
// Pre-booked seats (greyed out)
const bookedSeats = ['A3', 'A4', 'B7', 'C2', 'D5', 'D6', 'E9', 'F1', 'G3', 'H8'];

// ---- DOM ----
const grid = document.getElementById('movieGrid');
const langFilter = document.getElementById('langFilter');
const genreFilter = document.getElementById('genreFilter');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('movieModal');

// ---- Render movie cards ----
function renderMovies(list) {
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = '<p class="empty-state">No movies match your filters. Try adjusting your search.</p>';
    return;
  }
  grid.innerHTML = list.map(m => `
    <article class="movie-card" data-id="${m.id}">
      <img src="${m.poster}" alt="${m.title} poster" loading="lazy">
      <div class="movie-info">
        <h3>${m.title}</h3>
        <p class="meta">${m.language} • ${m.genre} • ${m.duration}</p>
        <span class="rating">★ ${m.rating}</span>
        <button class="btn">Book Now</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      openModal(movies.find(m => m.id === id));
    });
  });
}

// ---- Filtering ----
function applyFilters() {
  const lang = langFilter.value;
  const genre = genreFilter.value;
  const search = searchInput.value.toLowerCase().trim();
  const filtered = movies.filter(m =>
    (lang === 'all' || m.language === lang) &&
    (genre === 'all' || m.genre === genre) &&
    (search === '' || m.title.toLowerCase().includes(search))
  );
  renderMovies(filtered);
}
[langFilter, genreFilter].forEach(el => el && el.addEventListener('change', applyFilters));
if (searchInput) searchInput.addEventListener('input', applyFilters);

// ---- Modal: build & open ----
function openModal(movie) {
  selectedMovie = movie;
  selectedTime = null;
  selectedSeats = [];
  const showTimes = ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'];

  document.getElementById('modalContent').innerHTML = `
    <button class="modal-close" id="modalClose" aria-label="Close">×</button>
    <div class="modal-header">
      <img src="${movie.poster}" alt="${movie.title}">
      <div class="modal-header-info">
        <h2>${movie.title}</h2>
        <p class="meta">${movie.language} • ${movie.genre} • ${movie.duration}</p>
        <span class="rating">★ ${movie.rating}</span>
        <p style="margin-top:1rem;color:var(--text-grey);">${movie.description}</p>
        <p style="margin-top:0.5rem;color:var(--primary-dark);font-weight:600;">₹${movie.price} per seat</p>
      </div>
    </div>

    <div class="modal-section">
      <h3>Select Show Time</h3>
      <div class="timings">
        ${showTimes.map(t => `<button class="time-btn" data-time="${t}">${t}</button>`).join('')}
      </div>
    </div>

    <div class="modal-section">
      <h3>Select Your Seats</h3>
      <div class="screen">SCREEN</div>
      <div class="seat-legend">
        <div class="legend-item"><div class="legend-box"></div> Available</div>
        <div class="legend-item"><div class="legend-box selected"></div> Selected</div>
        <div class="legend-item"><div class="legend-box booked"></div> Booked</div>
      </div>
      <div class="seat-grid" id="seatGrid"></div>
    </div>

    <div class="booking-summary">
      <div class="summary-info">
        <strong>Seats:</strong> <span id="seatList">None</span><br>
        <strong>Total:</strong> ₹<span id="totalPrice">0</span>
      </div>
      <button class="btn" id="confirmBtn">Confirm Booking</button>
    </div>
  `;

  buildSeatGrid();

  // Wire up interactions
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = btn.dataset.time;
    });
  });
  document.getElementById('confirmBtn').addEventListener('click', confirmBooking);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close when clicking outside modal
if (modal) {
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}

// ---- Build 8x10 seat grid ----
function buildSeatGrid() {
  const rows = ['A','B','C','D','E','F','G','H'];
  const seatGrid = document.getElementById('seatGrid');
  let html = '<div></div>'; // top-left empty cell
  for (let c = 1; c <= 10; c++) html += `<div class="row-label">${c}</div>`;
  rows.forEach(row => {
    html += `<div class="row-label">${row}</div>`;
    for (let i = 1; i <= 10; i++) {
      const id = `${row}${i}`;
      const isBooked = bookedSeats.includes(id);
      html += `<button class="seat ${isBooked ? 'booked' : ''}" data-seat="${id}" ${isBooked ? 'disabled' : ''}>${i}</button>`;
    }
  });
  seatGrid.innerHTML = html;

  seatGrid.querySelectorAll('.seat:not(.booked)').forEach(seat => {
    seat.addEventListener('click', () => {
      const id = seat.dataset.seat;
      if (selectedSeats.includes(id)) {
        selectedSeats = selectedSeats.filter(s => s !== id);
        seat.classList.remove('selected');
      } else {
        selectedSeats.push(id);
        seat.classList.add('selected');
      }
      updateSummary();
    });
  });
}

function updateSummary() {
  document.getElementById('seatList').textContent =
    selectedSeats.length ? selectedSeats.sort().join(', ') : 'None';
  document.getElementById('totalPrice').textContent =
    selectedSeats.length * selectedMovie.price;
}

// ---- Confirm booking → save & redirect ----
function confirmBooking() {
  if (!selectedTime) { alert('Please select a show time.'); return; }
  if (selectedSeats.length === 0) { alert('Please select at least one seat.'); return; }

  // Build show date: tomorrow at the selected time
  const showDate = new Date();
  showDate.setDate(showDate.getDate() + 1);
  const [time, period] = selectedTime.split(' ');
  let [hh, mm] = time.split(':').map(Number);
  if (period === 'PM' && hh !== 12) hh += 12;
  if (period === 'AM' && hh === 12) hh = 0;
  showDate.setHours(hh, mm, 0, 0);

  const booking = {
    movie: selectedMovie.title,
    poster: selectedMovie.poster,
    language: selectedMovie.language,
    genre: selectedMovie.genre,
    showTime: selectedTime,
    showDate: showDate.toISOString(),
    seats: selectedSeats.sort(),
    total: selectedSeats.length * selectedMovie.price,
    bookedAt: new Date().toISOString()
  };

  localStorage.setItem('k7Booking', JSON.stringify(booking));
  window.location.href = 'reminder.html';
}

// ---- Initial render ----
renderMovies(movies);
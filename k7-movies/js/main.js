/* ============================================
   K7 Movies — Shared scripts (nav + carousel)
   ============================================ */

// ---- Mobile menu toggle ----
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
}

// ---- Highlight active nav link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ---- Auto-rotating carousel ----
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return; // only run on pages that have the carousel

  const slides = track.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let currentIndex = 0;
  let autoTimer = null;

  // Build dot indicators
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('.dot');

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function startAuto() {
    autoTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); stopAuto(); startAuto(); });
  nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); stopAuto(); startAuto(); });

  // Pause auto-rotate on hover
  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  startAuto();
}

document.addEventListener('DOMContentLoaded', initCarousel);
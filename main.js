/* ===== NAV HAMBURGER ===== */

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('is-open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('is-open'));
});


/* ===== STICKY NAV SCROLL SHADOW ===== */

const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.8) {
    mainNav.classList.add('is-scrolled');
  } else {
    mainNav.classList.remove('is-scrolled');
  }
}, { passive: true });


/* ===== GALLERY — DRAG SCROLL STRIP ===== */

const strip = document.getElementById('galleryStrip');
let isDown = false, startX, scrollLeft;

strip.addEventListener('mousedown', e => {
  isDown = true;
  strip.parentElement.style.cursor = 'grabbing';
  startX = e.pageX - strip.offsetLeft;
  scrollLeft = strip.parentElement.scrollLeft;
});
strip.addEventListener('mouseleave', () => { isDown = false; strip.parentElement.style.cursor = 'grab'; });
strip.addEventListener('mouseup', () => { isDown = false; strip.parentElement.style.cursor = 'grab'; });
strip.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - strip.offsetLeft;
  const walk = (x - startX) * 1.4;
  strip.parentElement.scrollLeft = scrollLeft - walk;
});


/* ===== LIGHTBOX ===== */

const lightboxImages = [
  { src: 'assets/images/00-Sunset_Sky.png',                      alt: 'Sunset sky over Queenstown' },
  { src: 'assets/images/02_Lounge-Outdoor_Terrace.png',          alt: 'Lounge and outdoor terrace' },
  { src: 'assets/images/03-Lake_View.png',                       alt: 'Lake Wakatipu views' },
  { src: 'assets/images/04-Private_Hot-Tub_Wood_Fired.png',      alt: 'Private wood-fired hot tub' },
  { src: 'assets/images/05-Indoor-Outdoor_Flow.png',             alt: 'Indoor-outdoor flow' },
  { src: 'assets/images/07-Cozy_Living-Dining.png',              alt: 'Cosy living and dining' },
  { src: 'assets/images/10-Bedroom_Loft.png',                    alt: 'Bedroom loft' },
  { src: 'assets/images/12-TV-Games-Chill_Loft.png',             alt: 'TV, games and chill loft' },
  { src: 'assets/images/13-Bathroom.png',                        alt: 'Bathroom' },
  { src: 'assets/images/18-Lake-Mountain_Views_from_Hot-Tub.png',alt: 'Lake and mountain views from hot tub' },
  { src: 'assets/images/19-Private-Outdoor_Living.png',          alt: 'Private outdoor living' },
  { src: 'assets/images/20_Kitchen-Dinning.png',                 alt: 'Kitchen and dining' },
  { src: 'assets/images/21_Parking.png',                         alt: 'Private parking' },
];

const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxCtr  = document.getElementById('lightboxCounter');
const total        = lightboxImages.length;
let lbCurrent      = 0;

function openLightbox(index) {
  lbCurrent = index;
  lightboxImg.src = lightboxImages[lbCurrent].src;
  lightboxImg.alt = lightboxImages[lbCurrent].alt;
  lightboxCtr.textContent = (lbCurrent + 1) + ' / ' + total;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  lbCurrent = (lbCurrent + dir + total) % total;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = lightboxImages[lbCurrent].src;
    lightboxImg.alt = lightboxImages[lbCurrent].alt;
    lightboxImg.style.opacity = '1';
    lightboxCtr.textContent = (lbCurrent + 1) + ' / ' + total;
  }, 180);
}

// Open from thumbnails — only if not dragging
let didDrag = false;
strip.addEventListener('mousedown', () => { didDrag = false; });
strip.addEventListener('mousemove', () => { didDrag = true; });

document.querySelectorAll('.gallery__thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    if (didDrag) return;
    openLightbox(parseInt(thumb.dataset.index));
  });
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => lightboxNav(-1));
document.getElementById('lightboxNext').addEventListener('click', () => lightboxNav(1));

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape')     closeLightbox();
});

// Touch swipe on lightbox
let lbTouchX = 0;
lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = lbTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) lightboxNav(diff > 0 ? 1 : -1);
});


/* ===== REVIEWS CAROUSEL ===== */

const revTrack = document.getElementById('reviewsTrack');
const revDots = document.getElementById('reviewsDots');
const reviewCards = revTrack.querySelectorAll('.review');
let revCurrent = 0;
let revTimer;
let cardsPerSlide = window.innerWidth > 768 ? 3 : 1;
let totalSlides = Math.ceil(reviewCards.length / cardsPerSlide);

function revBuildDots() {
  revDots.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const d = document.createElement('button');
    d.className = 'reviews__dot' + (i === 0 ? ' is-active' : '');
    d.setAttribute('aria-label', 'Go to review group ' + (i + 1));
    d.addEventListener('click', () => { revStopAuto(); revGoTo(i); revStartAuto(); });
    revDots.appendChild(d);
  }
}

function revUpdateDots() {
  revDots.querySelectorAll('.reviews__dot').forEach((d, i) => {
    d.classList.toggle('is-active', i === revCurrent);
  });
}

function revGoTo(index) {
  revCurrent = (index + totalSlides) % totalSlides;
  const cardWidth = reviewCards[0].offsetWidth;
  const gap = window.innerWidth > 768 ? 32 : 0; // 2rem gap
  const moveBy = cardsPerSlide * (cardWidth + gap);
  revTrack.style.transform = 'translateX(-' + revCurrent * moveBy + 'px)';
  revUpdateDots();
}

function revStartAuto() { revTimer = setInterval(() => revGoTo(revCurrent + 1), 6000); }
function revStopAuto()  { clearInterval(revTimer); }

document.getElementById('revPrev').addEventListener('click', () => { revStopAuto(); revGoTo(revCurrent - 1); revStartAuto(); });
document.getElementById('revNext').addEventListener('click', () => { revStopAuto(); revGoTo(revCurrent + 1); revStartAuto(); });

revTrack.closest('.reviews__track-wrap').addEventListener('mouseenter', revStopAuto);
revTrack.closest('.reviews__track-wrap').addEventListener('mouseleave', revStartAuto);

let revTouchX = 0;
revTrack.addEventListener('touchstart', e => { revTouchX = e.touches[0].clientX; }, { passive: true });
revTrack.addEventListener('touchend', e => {
  const diff = revTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    revStopAuto();
    revGoTo(revCurrent + (diff > 0 ? 1 : -1));
    revStartAuto();
  }
});

window.addEventListener('resize', () => {
  const newCardsPerSlide = window.innerWidth > 768 ? 3 : 1;
  if (newCardsPerSlide !== cardsPerSlide) {
    cardsPerSlide = newCardsPerSlide;
    totalSlides = Math.ceil(reviewCards.length / cardsPerSlide);
    revCurrent = 0;
    revBuildDots();
  }
  revGoTo(revCurrent);
});

// Init
revBuildDots();
revStartAuto();
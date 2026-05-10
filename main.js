/* ===== NAV HAMBURGER ===== */

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('is-open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('is-open'));
});


/* ===== SMOOTH SCROLL WITH NAV OFFSET ===== */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = document.querySelector('nav').offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
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


/* ===== GALLERY CAROUSEL ===== */

if (document.getElementById('galleryGlide')) {
  new Glide('#galleryGlide', {
    type: 'carousel',
    startAt: 0,
    perView: 3,
    gap: 6,
    breakpoints: {
      1200: { perView: 2 },
      768: { perView: 1 }
    }
  }).mount();
}


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

// Open from thumbnails
document.querySelectorAll('.gallery__thumb').forEach(thumb => {
  thumb.addEventListener('click', (e) => {
    // Glide handles drag prevention, but if needed we can check parent classes
    if (e.target.closest('.glide__slide--clone')) {
      // Cloned slides might not trigger correctly if we only rely on dataset index
      // but Glide clones the dataset attributes too, so it's usually fine
    }
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

if (document.getElementById('reviewsGlide')) {
  new Glide('#reviewsGlide', {
    type: 'carousel',
    startAt: 0,
    perView: 1,
    gap: 0,
    autoplay: 6000,
    hoverpause: true
  }).mount();
}


/* ===== GALLERY DISCLAIMER ACCORDION ===== */

const disclaimerBtn = document.querySelector('.disclaimer-toggle');
if (disclaimerBtn) {
  disclaimerBtn.addEventListener('click', () => {
    const expanded = disclaimerBtn.getAttribute('aria-expanded') === 'true';
    disclaimerBtn.setAttribute('aria-expanded', !expanded);
    const content = disclaimerBtn.nextElementSibling;
    content.hidden = expanded;
  });
}

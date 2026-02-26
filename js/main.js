// Lenis Smooth Scroll Initialization
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    // Handling smooth scroll with Lenis for anchor links
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        lenis.scrollTo(target, { offset: -80 });
      }
    }
    navLinks.classList.remove('active');
  });
});

// Intersection Observer for Reveal Animations
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '-80px' // Start animation slightly before entering
});

revealElements.forEach(el => revealObserver.observe(el));

// Quote Modal/Form Logic
const openQuoteModal = document.getElementById('openQuoteModal');
const quoteFormContainer = document.getElementById('quoteFormContainer');

if (openQuoteModal && quoteFormContainer) {
  openQuoteModal.addEventListener('click', () => {
    quoteFormContainer.style.display = 'block';
    lenis.scrollTo(quoteFormContainer, { offset: -100 });
    openQuoteModal.style.display = 'none';
  });
}

// B2B Cotización form submission moved to contact.js for organization

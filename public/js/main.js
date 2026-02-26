document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Initialize Lenis Smooth Scroll
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

    // Synchronize Lenis with anchor clicks for smooth navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#' || id === '') return;

            e.preventDefault();
            const target = document.querySelector(id);
            if (target) {
                lenis.scrollTo(target, {
                    offset: -80,
                    immediate: false,
                    duration: 1.5
                });
            }
        });
    });

    // Navbar Scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations (reveal)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.classList.add('visible');
        } else {
            revealOnScroll.observe(el);
        }
    });

    // Modal logic for Quote button (simple inline display for this pure JS implementation)
    const openQuoteModalBtn = document.getElementById('openQuoteModal');
    const quoteFormContainer = document.getElementById('quoteFormContainer');

    if (openQuoteModalBtn && quoteFormContainer) {
        openQuoteModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            quoteFormContainer.style.display = 'block';
            quoteFormContainer.style.opacity = '0';
            quoteFormContainer.style.transition = 'opacity 0.4s ease';

            // Allow display block to paint before animating opacity
            setTimeout(() => {
                quoteFormContainer.style.opacity = '1';
                quoteFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 10);
        });
    }

    // Brands Marquee simple auto-scroll handled natively if needed or via CSS animation
    // Since CSS can handle it smoothly, let's keep it CSS-based or add simple reset if it breaks.
});

/* ============================================================
   MAIN — main.js
   Navigation, scroll, carousel, accordion, form, loading
   ============================================================ */
(function() {
  // ---------- Loading Screen ----------
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) { loader.classList.add('hidden'); document.body.classList.remove('loading'); }
    }, 800);
  });

  // ---------- Scroll Progress ----------
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  }

  // ---------- Sticky Nav ----------
  const nav = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    const scrollY = window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', scrollY > 50);

    // Active link
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  // ---------- Back to Top ----------
  const backToTop = document.getElementById('back-to-top');
  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.pageYOffset > 500);
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Combined scroll handler
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNav();
    updateBackToTop();
  }, { passive: true });

  // ---------- Smooth Scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ---------- Mobile Menu ----------
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // ---------- FAQ Accordion ----------
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(ai => {
        ai.classList.remove('active');
        ai.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ---------- Testimonial Carousel ----------
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let currentSlide = 0;
  let autoSlideInterval;

  function getVisibleCards() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    const visible = getVisibleCards();
    const maxSlide = Math.max(0, cards.length - visible);
    if (currentSlide > maxSlide) currentSlide = maxSlide;
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0; // 24 = gap
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  function nextSlide() {
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    const maxSlide = Math.max(0, cards.length - getVisibleCards());
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateCarousel();
  }

  function prevSlide() {
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    const maxSlide = Math.max(0, cards.length - getVisibleCards());
    currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
    updateCarousel();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); resetAutoSlide(); });
  });

  function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 4000); }
  function resetAutoSlide() { clearInterval(autoSlideInterval); startAutoSlide(); }

  if (track) { startAutoSlide(); window.addEventListener('resize', updateCarousel); }

  // ---------- Contact Form ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const subject = form.querySelector('#subject').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Send using Fetch API for Netlify Forms
      const btn = form.querySelector('.btn-primary');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      })
      .then(() => {
        showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      })
      .catch(error => {
        showFormMessage('Something went wrong. Please try again.', 'error');
        btn.textContent = originalText;
        btn.disabled = false;
      });
    });
  }

  function showFormMessage(msg, type) {
    let el = document.getElementById('form-message');
    if (!el) {
      el = document.createElement('div');
      el.id = 'form-message';
      form.appendChild(el);
    }
    el.textContent = msg;
    el.style.cssText = `padding:0.75rem 1rem;border-radius:8px;margin-top:1rem;font-size:0.85rem;font-weight:500;${
      type === 'success'
        ? 'background:rgba(34,197,94,0.1);color:#16a34a;border:1px solid rgba(34,197,94,0.2)'
        : 'background:rgba(239,68,68,0.1);color:#dc2626;border:1px solid rgba(239,68,68,0.2)'
    }`;
    setTimeout(() => el.remove(), 5000);
  }

  // Init
  updateNav();
  updateBackToTop();
})();

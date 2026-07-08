/* ============================================================
   ANIMATIONS — animations.js
   Scroll reveal, counters, parallax, progress bars
   ============================================================ */
(function() {
  // ---------- Scroll Reveal ----------
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .text-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---------- Counter Animation ----------
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(update);
  }

  // ---------- Progress Bars ----------
  const progressBars = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(el => progressObserver.observe(el));

  // ---------- Parallax on Scroll ----------
  const parallaxEls = document.querySelectorAll('.parallax-element');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
        el.style.transform = `translateY(${scrollY * speed * -0.1}px)`;
      });
    }, { passive: true });
  }

  // ---------- Stagger Children ----------
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
          child.classList.add('revealed');
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => staggerObserver.observe(el));
})();

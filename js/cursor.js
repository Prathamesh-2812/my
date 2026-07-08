/* ============================================================
   CURSOR — cursor.js
   Custom cursor + magnetic buttons
   ============================================================ */
(function() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale on interactive elements
  const interactives = document.querySelectorAll('a, button, .btn, .nav-link, .accordion-header, input, textarea, .skill-card, .service-card, .project-card, .testimonial-card, .why-card, .tech-icon');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('active'); ring.classList.add('active'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('active'); ring.classList.remove('active'); });
  });

  // Magnetic buttons
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

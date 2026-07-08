/* ============================================================
   THEME — theme.js
   Dark mode toggle with localStorage
   ============================================================ */
(function() {
  const toggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('theme-toggle-mobile');
  const icon = document.getElementById('theme-icon');
  const mobileIcon = document.getElementById('theme-icon-mobile');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const isDark = theme === 'dark';
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (mobileIcon) mobileIcon.textContent = isDark ? '☀️' : '🌙';
  }

  // Initialize
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  if (toggle) toggle.addEventListener('click', toggleTheme);
  if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);
})();

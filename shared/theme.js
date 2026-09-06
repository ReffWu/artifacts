/**
 * Reff Artifacts - Universal Shared Theme Engine
 * 1. Immediate execution before DOM paint to prevent flash (FOUC).
 * 2. Automatic system preference sync (`prefers-color-scheme`).
 * 3. Manual override with persistent storage in `localStorage('reff_theme')`.
 * 4. Real-time multi-tab / multi-page synchronization via `storage` event.
 * 5. Automatic button icon injection and event binding for `.theme-toggle`.
 */

(function () {
  const STORAGE_KEY = 'reff_theme';

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function getActiveTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return getSystemPreference();
  }

  function updateToggleButtons(theme) {
    const isLight = theme === 'light';
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      const sun = btn.querySelector('.theme-icon-sun');
      const moon = btn.querySelector('.theme-icon-moon');
      if (sun && moon) {
        sun.style.display = isLight ? 'none' : 'block';
        moon.style.display = isLight ? 'block' : 'none';
      }
      btn.setAttribute('aria-label', isLight ? '切换为深色模式' : '切换为浅色模式');
      btn.setAttribute('title', isLight ? '当前浅色模式，点击切换为深色' : '当前深色模式，点击切换为浅色');
    });
  }

  function applyTheme(theme, save = false) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
    updateToggleButtons(theme);
  }

  // 1. Apply immediately on script load
  const initialTheme = getActiveTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // 2. Global toggle helper
  window.toggleReffTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || getActiveTheme();
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
  };

  // 3. Setup buttons on DOM ready
  function initButtons() {
    const current = document.documentElement.getAttribute('data-theme') || getActiveTheme();
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      // If the button has no SVGs, inject default standard icons
      if (!btn.querySelector('svg')) {
        btn.innerHTML = `
          <svg class="theme-icon-sun" style="display:none;" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
          <svg class="theme-icon-moon" viewBox="0 0 24 24"><path d="M12.3 2a10 10 0 0 0-.19 20 10.04 10.04 0 0 0 9.79-7.77 1 1 0 0 0-1.21-1.22A8 8 0 1 1 11.29 3.2 1 1 0 0 0 12.3 2z"/></svg>
        `;
      }
      btn.removeEventListener('click', window.toggleReffTheme);
      btn.addEventListener('click', window.toggleReffTheme);
    });
    updateToggleButtons(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtons);
  } else {
    initButtons();
  }

  // 4. Real-time Multi-Tab / Multi-Page Synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      const newTheme = e.newValue || getSystemPreference();
      applyTheme(newTheme, false);
    }
  });

  // 5. System preference change listener (fires when user OS switches between Light and Dark)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'light' : 'dark', false);
      }
    });
  }
})();

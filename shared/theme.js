/**
 * Reff Artifacts - Universal Shared Theme Engine
 * 1. System-First: Follows macOS/iOS system appearance (prefers-color-scheme) automatically.
 * 2. Purges stale legacy keys so system mode works out-of-the-box.
 * 3. Supports manual toggle override when user explicitly clicks.
 * 4. Resets to system auto immediately whenever the user changes their OS theme.
 * 5. Real-time multi-tab synchronization via storage events.
 */

(function () {
  const OVERRIDE_KEY = 'reff_theme_override';

  // 1. Purge legacy lock that prevented system following
  try {
    localStorage.removeItem('reff_theme');
  } catch (e) {}

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getEffectiveTheme() {
    const override = localStorage.getItem(OVERRIDE_KEY);
    if (override === 'light' || override === 'dark') {
      return override;
    }
    return getSystemTheme();
  }

  // Heroicons Solid Plump Icons (Balanced weight & optical alignment)
  const SUN_SVG = `<svg class="theme-icon-sun" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>`;
  const MOON_SVG = `<svg class="theme-icon-moon" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/></svg>`;

  function updateButtons(effectiveTheme) {
    const isDark = effectiveTheme === 'dark';
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      // Ensure standard SVGs exist
      if (!btn.querySelector('.theme-icon-sun')) {
        btn.innerHTML = SUN_SVG + MOON_SVG;
      }
      const sun = btn.querySelector('.theme-icon-sun');
      const moon = btn.querySelector('.theme-icon-moon');
      if (sun && moon) {
        // If current theme is Dark, show Sun (click to go Light)
        // If current theme is Light, show Moon (click to go Dark)
        sun.style.display = isDark ? 'block' : 'none';
        moon.style.display = isDark ? 'none' : 'block';
      }
      btn.setAttribute('aria-label', isDark ? '当前为深色模式，点击切换为浅色' : '当前为浅色模式，点击切换为深色');
      btn.setAttribute('title', isDark ? '点击切换为浅色模式' : '点击切换为深色模式');
    });
  }

  function applyTheme() {
    const override = localStorage.getItem(OVERRIDE_KEY);
    const effective = getEffectiveTheme();

    if (override === 'light' || override === 'dark') {
      document.documentElement.setAttribute('data-theme', override);
    } else {
      // Clean pure state: let CSS media queries handle it seamlessly
      document.documentElement.removeAttribute('data-theme');
    }
    updateButtons(effective);
  }

  // 2. Initial execution before paint
  applyTheme();

  // 3. Manual user toggle action
  window.toggleReffTheme = function () {
    const currentEffective = getEffectiveTheme();
    const nextTheme = currentEffective === 'dark' ? 'light' : 'dark';
    const systemTheme = getSystemTheme();

    // If next matches system, clear override back to pure auto
    if (nextTheme === systemTheme) {
      try { localStorage.removeItem(OVERRIDE_KEY); } catch (e) {}
    } else {
      try { localStorage.setItem(OVERRIDE_KEY, nextTheme); } catch (e) {}
    }
    applyTheme();
  };

  // 4. Setup buttons on DOM ready
  function initButtons() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      if (!btn.querySelector('.theme-icon-sun')) {
        btn.innerHTML = SUN_SVG + MOON_SVG;
      }
      btn.removeEventListener('click', window.toggleReffTheme);
      btn.addEventListener('click', window.toggleReffTheme);
    });
    updateButtons(getEffectiveTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtons);
  } else {
    initButtons();
  }

  // 5. Multi-tab real-time sync
  window.addEventListener('storage', (e) => {
    if (e.key === OVERRIDE_KEY) {
      applyTheme();
    }
  });

  // 6. System Appearance Change Listener (macOS / iOS settings change)
  if (window.matchMedia) {
    const darkMql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      // When user changes their OS theme, prioritize the OS change and clear old override
      try {
        localStorage.removeItem(OVERRIDE_KEY);
      } catch (e) {}
      applyTheme();
    };

    if (darkMql.addEventListener) {
      darkMql.addEventListener('change', handleSystemChange);
    } else if (darkMql.addListener) {
      darkMql.addListener(handleSystemChange);
    }
  }
})();

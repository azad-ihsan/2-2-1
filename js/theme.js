/**
 * Kurdish Calculator - Theme Management
 *
 * Handles dark/light theme switching with persistence
 */

class ThemeManager {
  constructor() {
    this.theme = "dark";
    this.toggle = Utils.$("#themeToggle");

    this.init();
  }

  init() {
    this.loadTheme();
    this.applyTheme();
    this.bindEvents();
  }

  bindEvents() {
    if (this.toggle) {
      this.toggle.addEventListener("click", () => this.toggleTheme());
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!Utils.storage.get("theme_preference")) {
          this.theme = e.matches ? "dark" : "light";
          this.applyTheme();
        }
      });
  }

  loadTheme() {
    // Check saved preference first
    const saved = Utils.storage.get("theme_preference");
    if (saved) {
      this.theme = saved;
      return;
    }

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      this.theme = "light";
    }
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme);

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = this.theme === "dark" ? "#0a0a0f" : "#f5f5f7";
    }

    // Update toggle button label
    if (this.toggle) {
      this.toggle.setAttribute(
        "aria-label",
        `Switch to ${this.theme === "dark" ? "light" : "dark"} theme`
      );
    }
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme();
    Utils.storage.set("theme_preference", this.theme);

    // Add animation to toggle
    if (this.toggle) {
      this.toggle.style.transform = "scale(0.9) rotate(180deg)";
      setTimeout(() => {
        this.toggle.style.transform = "";
      }, 300);
    }

    Utils.events.emit("themeChanged", this.theme);
  }

  getTheme() {
    return this.theme;
  }
}

// Export for global access
window.ThemeManager = ThemeManager;

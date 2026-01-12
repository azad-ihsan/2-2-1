/**
 * Unity Calculator - Main Application
 *
 * Application initialization and module coordination
 */

class App {
  constructor() {
    this.modules = {};
    this.isReady = false;
  }

  async init() {
    try {
      // Wait for DOM
      if (document.readyState === "loading") {
        await new Promise((resolve) => {
          document.addEventListener("DOMContentLoaded", resolve);
        });
      }

      // Initialize modules
      this.initModules();

      // Setup global event handlers
      this.setupGlobalEvents();

      // Setup info modal
      this.setupInfoModal();

      // Initialize premium interactions
      Utils.initMagneticButtons(
        Utils.$$(
          ".calc-btn, .history-panel__clear, .theme-toggle, .info-button"
        )
      );

      this.isReady = true;
      console.log("Unity Calculator initialized successfully");
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  }

  initModules() {
    // Initialize in order of dependency
    this.modules.theme = new ThemeManager();
    this.modules.audio = new AudioManager();
    this.modules.calculator = new Calculator();
    this.modules.history = new HistoryManager();
    this.modules.cultural = new CulturalExperience();

    // Connect history recall to calculator
    Utils.events.on("historyRecall", (value) => {
      this.modules.calculator.setValue(value);
    });
  }

  setupGlobalEvents() {
    // Handle visibility change (pause/resume)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        Utils.events.emit("appHidden");
      } else {
        Utils.events.emit("appVisible");
      }
    });

    // Prevent zoom on double tap (mobile)
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );

    // Handle reduced motion preference
    if (Utils.prefersReducedMotion()) {
      document.body.classList.add("reduced-motion");
    }
  }

  setupInfoModal() {
    const infoBtn = Utils.$("#infoButton");
    const modal = Utils.$("#infoModal");
    const closeBtn = Utils.$("#infoModalClose");
    const backdrop = Utils.$("#infoModalBackdrop");

    if (!infoBtn || !modal) return;

    const openModal = () => {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      closeBtn?.focus();
    };

    const closeModal = () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      infoBtn.focus();
    };

    infoBtn.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });

    // Trap focus in modal
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        const focusable = modal.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  getModule(name) {
    return this.modules[name];
  }
}

// Create and initialize the app
const app = new App();
app.init();

// Make app available globally for debugging
window.app = app;

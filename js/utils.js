/**
 * Unity Calculator - Utility Functions
 *
 * Common helper functions used across the application
 */

const Utils = {
  /**
   * DOM Query Shortcuts
   */
  $(selector, context = document) {
    return context.querySelector(selector);
  },

  $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  },

  /**
   * Create an element with attributes and children
   */
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "dataset") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  },

  /**
   * Debounce function execution
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function execution
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Format number with thousand separators
   */
  formatNumber(num) {
    if (typeof num !== "number" || isNaN(num)) return "0";

    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },

  /**
   * Parse formatted number back to number
   */
  parseFormattedNumber(str) {
    return parseFloat(str.replace(/,/g, ""));
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Local Storage helpers
   */
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn("Error reading from localStorage:", e);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn("Error writing to localStorage:", e);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    },
  },

  /**
   * Event emitter for app-wide communication
   */
  events: {
    _events: {},

    on(event, callback) {
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].push(callback);
    },

    off(event, callback) {
      if (!this._events[event]) return;
      this._events[event] = this._events[event].filter((cb) => cb !== callback);
    },

    emit(event, data) {
      if (!this._events[event]) return;
      this._events[event].forEach((callback) => callback(data));
    },
  },

  /**
   * Animation helpers
   */
  animate: {
    addClass(element, className, duration = 300) {
      return new Promise((resolve) => {
        element.classList.add(className);
        setTimeout(() => {
          element.classList.remove(className);
          resolve();
        }, duration);
      });
    },

    fadeIn(element, duration = 300) {
      element.style.opacity = "0";
      element.style.display = "block";
      element.style.transition = `opacity ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.opacity = "1";
      });

      return new Promise((resolve) => setTimeout(resolve, duration));
    },

    fadeOut(element, duration = 300) {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = "0";

      return new Promise((resolve) => {
        setTimeout(() => {
          element.style.display = "none";
          resolve();
        }, duration);
      });
    },
  },

  /**
   * Show toast notification
   */
  showToast(message, duration = 3000) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = this.createElement("div", { className: "toast" }, [message]);
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast--exiting");
      setTimeout(() => toast.remove(), 200);
    }, duration);
  },

  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  /**
   * Wait for a specified duration
   */
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  /**
   * Magnetic button effect for premium feel
   */
  initMagneticButtons(elements, strength = 0.3) {
    elements.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * strength}px, ${
          y * strength
        }px) scale(1.05)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0) scale(1)";
      });
    });
  },
};

// Make Utils available globally
window.Utils = Utils;

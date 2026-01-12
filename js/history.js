/**
 * Unity Calculator - History Management
 *
 * Manages calculation history with localStorage persistence
 */

class HistoryManager {
  constructor() {
    this.maxItems = 50;
    this.history = [];

    // DOM Elements
    this.panel = Utils.$("#historyPanel");
    this.list = Utils.$("#historyList");
    this.emptyState = Utils.$("#historyEmpty");
    this.clearBtn = Utils.$("#clearHistory");

    // Initialize
    this.init();
  }

  init() {
    this.loadHistory();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Listen for new calculations
    Utils.events.on("calculation", (data) => this.addItem(data));

    // Clear button
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clearHistory());
    }

    // Item clicks (event delegation)
    if (this.list) {
      this.list.addEventListener("click", (e) => {
        const item = e.target.closest(".history-item");
        const deleteBtn = e.target.closest(".history-item__delete");

        if (deleteBtn && item) {
          e.stopPropagation();
          this.removeItem(item.dataset.id);
        } else if (item) {
          this.recallItem(item.dataset.id);
        }
      });
    }
  }

  loadHistory() {
    this.history = Utils.storage.get("calculator_history", []);
  }

  saveHistory() {
    Utils.storage.set("calculator_history", this.history);
  }

  addItem(data) {
    const item = {
      id: Utils.generateId(),
      expression: data.expression,
      result: data.result,
      timestamp: data.timestamp,
      isUnity: data.isUnity || false,
    };

    // Add to beginning of array
    this.history.unshift(item);

    // Limit history size
    if (this.history.length > this.maxItems) {
      this.history.pop();
    }

    this.saveHistory();
    this.render();

    // Emit event for any listeners
    Utils.events.emit("historyUpdated", this.history);
  }

  removeItem(id) {
    const index = this.history.findIndex((item) => item.id === id);
    if (index === -1) return;

    // Animate removal
    const element = Utils.$(`[data-id="${id}"]`, this.list);
    if (element) {
      element.classList.add("removing");
      setTimeout(() => {
        this.history.splice(index, 1);
        this.saveHistory();
        this.render();
      }, 300);
    } else {
      this.history.splice(index, 1);
      this.saveHistory();
      this.render();
    }
  }

  clearHistory() {
    if (this.history.length === 0) return;

    // Confirm clear
    this.history = [];
    this.saveHistory();
    this.render();

    Utils.showToast("History cleared");
    Utils.events.emit("historyCleared");
  }

  recallItem(id) {
    const item = this.history.find((h) => h.id === id);
    if (!item) return;

    // Emit event for calculator to pick up
    Utils.events.emit("historyRecall", item.result);
    Utils.showToast("Value recalled");
  }

  render() {
    if (!this.list) return;

    // Clear existing items
    this.list.innerHTML = "";

    // Show/hide empty state
    if (this.history.length === 0) {
      this.emptyState.hidden = false;
      return;
    }

    this.emptyState.hidden = true;

    // Render items
    this.history.forEach((item, index) => {
      const element = this.createItemElement(item, index);
      this.list.appendChild(element);
    });
  }

  createItemElement(item, index) {
    const li = Utils.createElement("li", {
      className: `history-item ${item.isUnity ? "history-item--special" : ""}`,
      dataset: { id: item.id },
      role: "listitem",
      tabIndex: 0,
      "aria-label": `${item.expression} equals ${item.result}`,
    });

    // Content Wrapper
    const content = Utils.createElement("div", {
      className: "history-item__content",
    });

    // Expression
    const expression = Utils.createElement(
      "div",
      {
        className: "history-item__expression",
      },
      [item.expression]
    );

    // Result
    const result = Utils.createElement(
      "div",
      {
        className: "history-item__result",
      },
      [item.isUnity ? "= 1 ✨" : `= ${item.result}`]
    );

    content.appendChild(expression);
    content.appendChild(result);

    // Delete button
    const deleteBtn = Utils.createElement("button", {
      className: "history-item__delete",
      "aria-label": "Delete this calculation",
    });
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;

    li.appendChild(content);
    li.appendChild(deleteBtn);

    // Add staggered animation delay
    li.style.animationDelay = `${index * 0.05}s`;

    return li;
  }

  getHistory() {
    return [...this.history];
  }

  getLatest(count = 5) {
    return this.history.slice(0, count);
  }
}

// Export for global access
window.HistoryManager = HistoryManager;

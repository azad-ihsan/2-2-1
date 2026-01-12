/**
 * Kurdish Calculator - Core Calculator Logic
 *
 * Handles all calculation operations with clean separation of concerns
 */

class Calculator {
  constructor() {
    // State
    this.currentValue = "0";
    this.previousValue = "";
    this.operator = null;
    this.shouldResetDisplay = false;
    this.lastResult = null;

    // DOM Elements
    this.display = Utils.$("#display");
    this.historyDisplay = Utils.$("#historyDisplay");
    this.buttons = Utils.$$(".calc-btn");

    // Bind methods
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    // Initialize
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadState();
    this.updateDisplay();
  }

  bindEvents() {
    // Button clicks
    this.buttons.forEach((button) => {
      button.addEventListener("click", this.handleButtonClick);
    });

    // Keyboard support
    document.addEventListener("keydown", this.handleKeyDown);
  }

  handleButtonClick(e) {
    const button = e.currentTarget;
    const action = button.dataset.action;
    const value = button.dataset.value;

    // Add visual feedback
    this.addButtonFeedback(button);

    // Handle action
    this.processAction(action, value);
  }

  handleKeyDown(e) {
    // Ignore if modal is open or cultural experience is active
    if (
      document.querySelector(".cultural-overlay.active") ||
      document.querySelector(".info-modal.active")
    ) {
      return;
    }

    const key = e.key;

    // Number keys
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      this.processAction("number", key);
      this.highlightButton(`[data-value="${key}"]`);
    }
    // Operators
    else if (["+", "-", "*", "/"].includes(key)) {
      e.preventDefault();
      this.processAction("operator", key);
      this.highlightButton(`[data-value="${key}"]`);
    }
    // Enter or =
    else if (key === "Enter" || key === "=") {
      e.preventDefault();
      this.processAction("calculate");
      this.highlightButton('[data-action="calculate"]');
    }
    // Backspace
    else if (key === "Backspace") {
      e.preventDefault();
      this.processAction("backspace");
      this.highlightButton('[data-action="backspace"]');
    }
    // Escape or C for clear
    else if (key === "Escape" || key.toLowerCase() === "c") {
      e.preventDefault();
      this.processAction("clear");
      this.highlightButton('[data-action="clear"]');
    }
    // Decimal
    else if (key === ".") {
      e.preventDefault();
      this.processAction("decimal");
      this.highlightButton('[data-action="decimal"]');
    }
    // Percentage
    else if (key === "%") {
      e.preventDefault();
      this.processAction("percent");
      this.highlightButton('[data-action="percent"]');
    }
  }

  highlightButton(selector) {
    const button = Utils.$(selector);
    if (button) {
      this.addButtonFeedback(button);
    }
  }

  addButtonFeedback(button) {
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 150);
  }

  processAction(action, value) {
    switch (action) {
      case "number":
        this.inputNumber(value);
        break;
      case "operator":
        this.inputOperator(value);
        break;
      case "calculate":
        this.calculate();
        break;
      case "clear":
        this.clear();
        break;
      case "backspace":
        this.backspace();
        break;
      case "decimal":
        this.inputDecimal();
        break;
      case "percent":
        this.calculatePercent();
        break;
      case "negate":
        this.negate();
        break;
    }

    this.updateDisplay();
    this.saveState();
  }

  inputNumber(num) {
    if (this.shouldResetDisplay) {
      this.currentValue = num;
      this.shouldResetDisplay = false;
    } else {
      // Prevent multiple leading zeros
      if (this.currentValue === "0" && num === "0") return;
      // Replace initial zero with number
      if (this.currentValue === "0") {
        this.currentValue = num;
      } else {
        // Limit input length
        if (this.currentValue.length >= 15) return;
        this.currentValue += num;
      }
    }

    // Add typing animation
    this.display.classList.add("typing");
    setTimeout(() => this.display.classList.remove("typing"), 150);
  }

  inputOperator(op) {
    if (this.operator && !this.shouldResetDisplay) {
      this.calculate(false);
    }

    this.previousValue = this.currentValue;
    this.operator = op;
    this.shouldResetDisplay = true;

    // Update history display
    this.updateHistoryDisplay();

    // Highlight active operator
    this.updateOperatorHighlight(op);
  }

  updateOperatorHighlight(op) {
    // Remove all operator highlights
    Utils.$$(".calc-btn--operator").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add highlight to current operator
    const opButton = Utils.$(`[data-value="${op}"]`);
    if (opButton) {
      opButton.classList.add("active");
    }
  }

  inputDecimal() {
    if (this.shouldResetDisplay) {
      this.currentValue = "0.";
      this.shouldResetDisplay = false;
      return;
    }

    if (!this.currentValue.includes(".")) {
      this.currentValue += ".";
    }
  }

  calculatePercent() {
    const current = parseFloat(this.currentValue);
    if (this.previousValue && this.operator) {
      // Calculate percentage of previous value
      const prev = parseFloat(this.previousValue);
      this.currentValue = String(prev * (current / 100));
    } else {
      // Just divide by 100
      this.currentValue = String(current / 100);
    }
  }

  negate() {
    if (this.currentValue !== "0") {
      if (this.currentValue.startsWith("-")) {
        this.currentValue = this.currentValue.slice(1);
      } else {
        this.currentValue = "-" + this.currentValue;
      }
    }
  }

  backspace() {
    if (
      this.currentValue.length === 1 ||
      (this.currentValue.length === 2 && this.currentValue.startsWith("-"))
    ) {
      this.currentValue = "0";
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
  }

  clear() {
    this.currentValue = "0";
    this.previousValue = "";
    this.operator = null;
    this.shouldResetDisplay = false;
    this.historyDisplay.textContent = "";

    // Remove operator highlights
    Utils.$$(".calc-btn--operator").forEach((btn) => {
      btn.classList.remove("active");
    });
  }

  calculate(addToHistory = true) {
    if (!this.operator || !this.previousValue) return;

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    const expression = `${this.previousValue} ${this.getOperatorSymbol(
      this.operator
    )} ${this.currentValue}`;

    // Check for special "2 + 2 = 1" case
    if (this.isUnityExpression(prev, current, this.operator)) {
      this.handleUnityCalculation(expression);
      return;
    }

    let result;

    try {
      switch (this.operator) {
        case "+":
          result = prev + current;
          break;
        case "-":
          result = prev - current;
          break;
        case "*":
          result = prev * current;
          break;
        case "/":
          if (current === 0) {
            this.showError("Cannot divide by zero");
            return;
          }
          result = prev / current;
          break;
        default:
          return;
      }

      // Handle floating point precision
      result = this.roundResult(result);

      // Store for history
      if (addToHistory) {
        Utils.events.emit("calculation", {
          expression,
          result: String(result),
          timestamp: Date.now(),
        });
      }

      // Update state
      this.lastResult = result;
      this.currentValue = String(result);
      this.previousValue = "";
      this.operator = null;
      this.shouldResetDisplay = true;
      this.historyDisplay.textContent = expression + " =";

      // Add result animation
      this.display.classList.add("calculating", "result");
      setTimeout(() => {
        this.display.classList.remove("calculating");
      }, 300);

      // Remove operator highlights
      Utils.$$(".calc-btn--operator").forEach((btn) => {
        btn.classList.remove("active");
      });
    } catch (error) {
      this.showError("Calculation error");
    }
  }

  isUnityExpression(a, b, operator) {
    return a === 2 && b === 2 && operator === "+";
  }

  handleUnityCalculation(expression) {
    // Emit special event for cultural experience
    Utils.events.emit("unity", {
      expression,
      timestamp: Date.now(),
    });

    // Add to history with special flag
    Utils.events.emit("calculation", {
      expression,
      result: "1",
      timestamp: Date.now(),
      isUnity: true,
    });

    // Update display
    this.currentValue = "1";
    this.previousValue = "";
    this.operator = null;
    this.shouldResetDisplay = true;
    this.historyDisplay.textContent = "2 + 2 =";

    // Special display class
    this.display.classList.add("result");
  }

  roundResult(num) {
    // Handle floating point precision issues
    const precision = 12;
    return parseFloat(num.toPrecision(precision));
  }

  showError(message) {
    Utils.showToast(message);
    this.display.classList.add("shake", "error");
    setTimeout(() => {
      this.display.classList.remove("shake", "error");
    }, 400);
  }

  getOperatorSymbol(op) {
    const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
    return symbols[op] || op;
  }

  updateDisplay() {
    // Format large numbers
    const displayValue = this.formatDisplayValue(this.currentValue);
    this.display.textContent = displayValue;

    // Adjust font size for long numbers
    this.adjustDisplayFontSize(displayValue);
  }

  formatDisplayValue(value) {
    // Handle special values
    if (value === "Infinity" || value === "-Infinity") {
      return "∞";
    }
    if (value === "NaN") {
      return "Error";
    }

    // Don't format if ends with decimal or is being input
    if (value.endsWith(".") || this.currentValue.includes("e")) {
      return value;
    }

    // Parse and format
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // Use scientific notation for very large/small numbers
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }

    // Format with commas
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  adjustDisplayFontSize(value) {
    const length = value.replace(/,/g, "").length;

    if (length > 12) {
      this.display.style.fontSize = "var(--font-size-2xl)";
    } else if (length > 9) {
      this.display.style.fontSize = "var(--font-size-3xl)";
    } else {
      this.display.style.fontSize = "";
    }
  }

  updateHistoryDisplay() {
    const symbol = this.getOperatorSymbol(this.operator);
    this.historyDisplay.textContent = `${this.previousValue} ${symbol}`;
  }

  saveState() {
    Utils.storage.set("calculator_state", {
      currentValue: this.currentValue,
      previousValue: this.previousValue,
      operator: this.operator,
    });
  }

  loadState() {
    const state = Utils.storage.get("calculator_state");
    if (state) {
      this.currentValue = state.currentValue || "0";
      this.previousValue = state.previousValue || "";
      this.operator = state.operator || null;

      if (this.previousValue && this.operator) {
        this.updateHistoryDisplay();
      }
    }
  }

  // Public method to set value (for history recall)
  setValue(value) {
    this.clear();
    this.currentValue = value;
    this.updateDisplay();
    this.saveState();
  }
}

// Export for global access
window.Calculator = Calculator;

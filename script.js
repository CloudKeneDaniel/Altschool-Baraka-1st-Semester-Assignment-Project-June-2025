document.addEventListener("DOMContentLoaded", function () {
  const display = document.querySelector("input.display");
  // Prevent manual typing in the display but allow focus and caret
  display.addEventListener("keydown", function (e) {
    // Allow navigation keys (arrows, home, end, tab), but block all input
    const navKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Tab",
      "Shift",
      "Control",
      "Alt",
    ];
    if (!navKeys.includes(e.key)) {
      e.preventDefault();
    }
  });
  // Get all calculator buttons
  const buttons = document.querySelectorAll(".buttons button");
  let current = "";
  let lastInput = "";

  // Update the display with the current value
  function updateDisplay(val) {
    display.value = val;
  }

  // Evaluate the expression safely (handles operators and errors)
  function safeEval(expr) {
    expr = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/%/g, "/100");
    try {
      // eslint-disable-next-line no-eval
      let result = eval(expr);
      if (typeof result === "number" && !isFinite(result)) return "Error";
      return result;
    } catch {
      return "Error";
    }
  }

  // Check if a character is an operator
  function isOperator(char) {
    return ["+", "-", "*", "/", "×", "÷", "^", "%"].includes(char);
  }

  // Handle input from buttons or keyboard
  function handleInput(value) {
    if (value === ".") {
      // Prevent multiple decimals in a number
      const parts = current.split(/[\+\-\*\/×÷\^%]/);
      if (parts[parts.length - 1].includes(".")) return;
    }
    if (isOperator(value)) {
      // Prevent two operators in a row
      if (current === "" && value !== "-" && value !== "+") return;
      if (isOperator(lastInput)) {
        current = current.slice(0, -1);
      }
    }
    current += value;
    lastInput = value;
    updateDisplay(current);
  }

  // Handle equals button or Enter key
  function handleEquals() {
    let result = safeEval(current);
    updateDisplay(result);
    current = result === "Error" ? "" : String(result);
    lastInput = "";
  }

  // Handle backspace button or key
  function handleBackspace() {
    current = current.slice(0, -1);
    lastInput = current.slice(-1);
    updateDisplay(current);
  }

  // Handle clear (C) button or Escape/Delete key
  function handleClear() {
    current = "";
    lastInput = "";
    updateDisplay("");
  }

  // Add click event listeners to all calculator buttons
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      if (
        this.classList.contains("number") ||
        this.classList.contains("operator")
      ) {
        if (this.classList.contains("clear")) {
          handleClear();
        } else {
          handleInput(this.textContent.trim());
        }
      } else if (this.classList.contains("equals")) {
        handleEquals();
      } else if (this.classList.contains("backspace")) {
        handleBackspace();
      }
    });
  });
  // Keyboard support
  document.addEventListener("keydown", function (e) {
    if (e.key >= "0" && e.key <= "9") {
      handleInput(e.key);
    } else if (["+", "-", "*", "/", "^", "%"].includes(e.key)) {
      handleInput(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
      handleEquals();
      e.preventDefault();
    } else if (e.key === "Backspace") {
      handleBackspace();
      e.preventDefault();
    } else if (e.key === "Delete" || e.key === "Escape") {
      handleClear();
      e.preventDefault();
    } else if (e.key === ".") {
      handleInput(".");
    }
  });

  // Initialize display to empty on load
  updateDisplay("");
});

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";

function show(value) {
  display.value = value;
}

function isOperator(value) {
  return ["+", "-", "*", "/"].includes(value);
}

buttons.forEach((button) => {
  // Prevent old inline onclick code from interfering.
  button.removeAttribute("onclick");

  button.addEventListener("click", () => {
    let value = button.textContent.trim();

    if (value === "C") {
      expression = "";
      show("0");
      return;
    }

    if (value === "DEL") {
      expression = expression.slice(0, -1);
      show(expression || "0");
      return;
    }

    if (value === "=") {
      calculate();
      return;
    }

    // Convert the visible calculator symbols into JavaScript symbols.
    if (value === "×") value = "*";
    if (value === "÷") value = "/";

    if (expression === "Error") {
      expression = "";
    }

    const lastCharacter = expression.slice(-1);

    // Do not allow two operators next to each other.
    if (isOperator(value) && isOperator(lastCharacter)) {
      expression = expression.slice(0, -1) + value;
    } else if (expression === "" && isOperator(value) && value !== "-") {
      return;
    } else {
      expression += value;
    }

    show(expression);
  });
});

function calculate() {
  if (expression === "") return;

  try {
    const answer = Function(`"use strict"; return (${expression})`)();

    if (Number.isFinite(answer)) {
      expression = String(answer);
      show(expression);
    } else {
      expression = "Error";
      show("Error");
    }
  } catch {
    expression = "Error";
    show("Error");
  }
}
let currentNumber = '';
let previousNumber = '';
let operation = undefined;
let history = [];

const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');

function appendNumber(number) {
    if (number === '.' && currentNumber.includes('.')) return;
    currentNumber = currentNumber.toString() + number.toString();
    updateDisplay();
}

function updateDisplay() {
    display.innerText = currentNumber;
}

function updateHistory() {
    historyDisplay.innerHTML = history.join('<br>');
}

function chooseOperation(op) {
    if (currentNumber === '') return;
    if (previousNumber !== '') {
        compute();
    }
    operation = op;
    previousNumber = currentNumber;
    currentNumber = '';
}

function compute() {
    let computation;
    const prev = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    history.push(`${previousNumber} ${operation} ${currentNumber} = ${computation}`);
    currentNumber = computation;
    operation = undefined;
    previousNumber = '';
    updateDisplay();
    updateHistory();
}

function clearDisplay() {
    currentNumber = '';
    previousNumber = '';
    operation = undefined;
    updateDisplay();
}

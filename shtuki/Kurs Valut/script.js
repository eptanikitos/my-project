const currencySelect = document.getElementById("currency-select");
const currencyTable = document.getElementById("currency-table");
const selectedCurrencyRate = document.getElementById("selected-currency-rate");
const uahAmountInput = document.getElementById("uah-amount");
const currencyAmountInput = document.getElementById("currency-amount");

let currentRates = [];

async function fetchCurrencyRates() {
  try {
    const response = await fetch(
      "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
    );
    const data = await response.json();
    currentRates = data;
    populateCurrencySelect(data);
    displayCurrencyRates(data, currencySelect.value);
  } catch (error) {
    console.error("Ошибка получения данных:", error);
  }
}

function populateCurrencySelect(rates) {
  currencySelect.innerHTML = ""; // Очистка списка перед заполнением
  rates.forEach((rate) => {
    const option = document.createElement("option");
    option.value = rate.cc;
    option.textContent = rate.txt;
    currencySelect.appendChild(option);
  });
  currencySelect.addEventListener("change", () => {
    displayCurrencyRates(rates, currencySelect.value);
    convertAmountFromUAH();
  });
}

function displayCurrencyRates(rates, selectedCurrency) {
  currencyTable.innerHTML = "";
  selectedCurrencyRate.innerHTML = "";

  rates.forEach((rate) => {
    if (rate.cc === selectedCurrency) {
      selectedCurrencyRate.textContent = `1 ${rate.txt} = ${rate.rate.toFixed(
        2
      )} UAH`;
      const row = document.createElement("tr");
      const currencyCell = document.createElement("td");
      const rateCell = document.createElement("td");

      currencyCell.textContent = rate.txt;
      rateCell.textContent = rate.rate.toFixed(2);

      row.appendChild(currencyCell);
      row.appendChild(rateCell);
      currencyTable.appendChild(row);
    }
  });
}

function convertAmountFromUAH() {
  const uahAmount = parseFloat(uahAmountInput.value);
  const selectedCurrency = currencySelect.value;

  if (isNaN(uahAmount) || uahAmount < 0) {
    currencyAmountInput.value = "";
    return;
  }

  const rate = currentRates.find((rate) => rate.cc === selectedCurrency).rate;
  const convertedAmount = (uahAmount / rate).toFixed(2);
  currencyAmountInput.value = convertedAmount;
}

function convertAmountToUAH() {
  const currencyAmount = parseFloat(currencyAmountInput.value);
  const selectedCurrency = currencySelect.value;

  if (isNaN(currencyAmount) || currencyAmount < 0) {
    uahAmountInput.value = "";
    return;
  }

  const rate = currentRates.find((rate) => rate.cc === selectedCurrency).rate;
  const convertedAmount = (currencyAmount * rate).toFixed(2);
  uahAmountInput.value = convertedAmount;
}

fetchCurrencyRates();
setInterval(fetchCurrencyRates, 2000); // Обновление каждые 20 секунд

uahAmountInput.addEventListener("input", convertAmountFromUAH);
currencyAmountInput.addEventListener("input", convertAmountToUAH);

"use strict";

const tickerInput = document.getElementById("ticker_input_box");
const investmentInput = document.getElementById("investment_input_box");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const stockListContainer = document.querySelector(".stockListContainer");
const blendContainer = document.querySelector(".blendContainer");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");
const DIRT = Number(1.0);
const ROCK = Number(3.0);
const SAND = Number(5.0);
const LAVA = Number(9.0);
let tickerInputValue, divYieldTTM;
let divYieldArray = [];
let investedArray = [];
let annualDivArray = [];

/* ==========================FETCH & DISPLAYING FUNCTION======================== */

const fetchStockData = async function () {
  let tickerInputValue = tickerInput.value.toUpperCase();
  let investmentInputValue = Number(Math.floor(investmentInput.value));
  let totalInvestment = 0;
  let totalAnnualDividends = 0;
  let blendedDividendRate = 0;

  await fetch(
    `https://financialmodelingprep.com/api/v3/ratios-ttm/${tickerInputValue}?apikey=919a18141943e907b400189a4105af89`
  )
    .then((data) => {
      return data.json();
    })
    .then((completeData) => {
      /* ==========================DUMMY VARIABLE LOGIC======================== */
      if (tickerInputValue === "DIRT") {
        divYieldTTM = DIRT;
      } else if (tickerInputValue === "ROCK") {
        divYieldTTM = ROCK;
      } else if (tickerInputValue === "SAND") {
        divYieldTTM = SAND;
      } else if (tickerInputValue === "LAVA") {
        divYieldTTM = LAVA;
      } else {
        divYieldTTM = completeData[0].dividendYielTTM.toFixed(4) * 100;
      }

      let calc1AnnualDividend =
        Number(investmentInputValue) * (Number(divYieldTTM) * 0.01);
      let annualDividend = Number(calc1AnnualDividend.toFixed(2));

      /* ==========================ARRAYS AND VALUE ADDS TO ARRAYS======================== */
      divYieldArray.push(divYieldTTM);
      investedArray.push(investmentInputValue);
      annualDivArray.push(annualDividend);

      investedArray.forEach(function (investment, i, arr) {
        totalInvestment += Number(investment.toFixed(2));
      });
      annualDivArray.forEach(function (annualDiv, i, arr) {
        totalAnnualDividends += Number(annualDiv.toFixed(2));
      });
      divYieldArray.forEach(function (divRate, i, arr) {
        let divProportion = divRate * (investedArray[i] / totalInvestment);
        blendedDividendRate += Number(divProportion.toFixed(2));
      });

      let roundedDivYieldTTM = divYieldTTM.toFixed(2);
      let roundedTotalAnnualDividends = totalAnnualDividends.toFixed(2);
      let roundedBlendedDividendRate = blendedDividendRate.toFixed(2);
      let roundedTotalInvestment = totalInvestment.toFixed(2);

      /* ==========================HTML TO POPULATE BLENDER======================== */
      const dividendRow = `
      <div class="stock-row">

      <div class="stock-attribute">
          <div class="attribute-title">Ticker Symbol</div>
          <div class="value-text ticker-symbol">${tickerInputValue}</div>
      </div>
      <div class="stock-attribute">
          <div class="attribute-title">Dividend Yield</div>
          <div class="value-text value-divyield">${
            roundedDivYieldTTM + "%"
          }</div>
      </div>
      <div class="stock-attribute">
          <div class="attribute-title">$ Investment Amount</div>
          <div class="value-text value-investmentamount">${
            "$" + investmentInputValue
          }</div>
      </div>
      <div class="stock-attribute">
          <div class="attribute-title">$ Annual Dividend Amount</div>
          <div class="value-text value-investmentamount">${
            "$" + annualDividend
          }</div>
      </div>

      </div>
          `;

      clearTotals();
      const totalRow = `
      <div class="blend-container">
      <div class="total-row">
      <div class"totalTitle">Total Investment, annual dividends and blended Dividend Rate</div>
      <div class="break"></div>
        <div class="stock-attribute">
          <div class="attribute-title">Blended Dividend Yield</div>
          <div class="value-text">${roundedBlendedDividendRate + "%"}</div>
        </div>
        <div class="stock-attribute">
          <div class="attribute-title">Total Invested</div>
          <div class="value-text">${"$" + roundedTotalInvestment}</div>
        </div>
        <div class="stock-attribute">
          <div class="attribute-title">Total Annual Dividends</div>
          <div class="value-text">${"$" + roundedTotalAnnualDividends}</div>
        </div>
      </div>  
    </div>
    `;

      stockListContainer.insertAdjacentHTML("beforeend", dividendRow);
      blendContainer.innerHTML = totalRow;
    });
};

/* ==========================DATA CLEARING FUNCTIONS======================== */

const clearTotals = function () {
  blendContainer.innerHTML = "";
};

const clearArrays = function () {
  return (divYieldArray = []), (investedArray = []), (annualDivArray = []);
};

const clearDividendList = function () {
  stockListContainer.innerHTML = "";
  clearTotals();
  clearArrays();
};

/* ==========================MODAL FUNCTIONS======================== */

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

/* ==========================EVENT LISTENERS======================== */

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

submitBtn.addEventListener("click", fetchStockData);
clearBtn.addEventListener("click", clearDividendList);

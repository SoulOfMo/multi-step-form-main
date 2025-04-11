//// SELECTING ELEMENT
"use strict";

const toggleBtn = document.querySelector(".toggle"),
  slider = document.querySelector(".slider"),
  monthBtn = document.querySelector(".month-plan"),
  yearBtn = document.querySelector(".year-plan"),
  pages = document.querySelectorAll(".page"),
  sidebarBtn = document.querySelectorAll(".btn"),
  nav = document.querySelector(".nav"),
  prevBtn = document.querySelector(".prevBtn"),
  nextBtn = document.querySelector(".nextBtn"),
  // Plans ELEMENT
  planPrices = document.querySelectorAll(".plan-prices"),
  planInput = document.querySelectorAll("input[type='radio']"),
  //Summary Section Element
  summaryContainer = document.getElementById("summary");
//// Setting default value
let currentState = 0;
let price = 9;

//Data
const monthly = {
  planName: "Monthly",
  planDuration: "mo",
  planPrices: [9, 12, 15],
  planType: ["Arcade", "Advanced", "Pro"],
  addsOnPrices: [1, 2, 2],
  addsOnType: ["Online Service", "Large storage", "Customizable profile"],
  addsOnTypeDetails: [
    "Access to multiplayer games",
    "Extra 1TB of cloud save",
    "Custom theme on your profile",
  ],
};

const yearly = {
  planName: "Yearly",
  planDuration: "yr",
  planPrices: [90, 120, 150],
  planType: ["Arcade", "Advanced", "Pro"],
  addsOnPrices: [10, 20, 20],
  addsOnType: ["Online Service", "Large storage", "Customizable profile"],
  addsOnTypeDetails: monthly.addsOnTypeDetails,
};

window.addEventListener(
  "DOMContentLoaded",
  () => currentState == 0 && prevBtn.classList.add("hide-el")
);

//Summary Section Element
const planSummaryDetails = document.querySelector(".plan-summary-details"),
  planPicked = document.querySelector(".plan-picked"),
  planDurationSummary = document.querySelector(".plan-duration-summary"),
  planPickedPrice = document.querySelector(".plan-picked-price"),
  addOnSummary = document.querySelector(".addOns-picked");

//NEXT BUTTON AND PREV BUTTON
nextBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (currentState === 3) {
    pages[currentState].classList.add("hidden");
    pages[4].classList.remove("hidden");
    nav.classList.add("hide-navbtn");
    return;
  }
  const inputs = pages[0].querySelectorAll("input[required]");

  let allValid = true;
  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      allValid = false;
      input.parentElement.classList.add("error");
      console.log(input.parentElement.querySelector(".err-msg"));
      const errMsg = input.parantElement.querySelector(".err-msg");
      errMsg.textContent = "This field is required";

      setTimeout(() => {
        input.parentElement.classList.remove("error");
      }, "3000");
    }
  });

  // localstroage here

  if (allValid) {
    pages[currentState].classList.add("hidden");
    sidebarBtn[currentState].classList.remove("active");

    currentState < 3 && currentState++;

    currentState > 0 && prevBtn.classList.remove("hide-el");
    currentState === 3 && (nextBtn.textContent = "Confirm");

    if (pages[currentState].classList.contains("hidden")) {
      pages[currentState].classList.remove("hidden");
      sidebarBtn[currentState].classList.add("active");
    }
  }
});

prevBtn.addEventListener("click", function () {
  pages[currentState].classList.add("hidden");
  sidebarBtn[currentState].classList.remove("active");
  currentState === 0 ? (currentState = 0) : currentState--;
  currentState === 0 && prevBtn.classList.add("hide-el");
  if (currentState < 3) {
    nextBtn.textContent = "Next Step";
  }

  if (pages[currentState].classList.contains("hidden")) {
    pages[currentState].classList.remove("hidden");
    sidebarBtn[currentState].classList.add("active");
  }
});

//Updating the plan picked UI in the summary
const updatePlan = function (plan, index) {
  const id = Number(index);
  return `<div>
              <div class="plan-summary">
                <span class="plan-picked">${plan.planType[id]}</span>
                <span class="plan-duration-summary">(${plan.planName})</span>
              </div>
              <span class="change-plan">Change</span>
            </div>

            <div class="plan-picked-price">$${plan.planPrices[id]}/${plan.planDuration}</div>
          </div>`;
};

planSummaryDetails.innerHTML = updatePlan(monthly, 0);

planInput.forEach((planInp, id) => {
  planInp.addEventListener("change", function () {
    const durationType = slider.classList.contains("slider-active");
    price = durationType ? yearly.planPrices[id] : monthly.planPrices[id];
    const planChoose = durationType
      ? updatePlan(yearly, id)
      : updatePlan(monthly, id);
    planSummaryDetails.innerHTML = planChoose;
  });
});

// AddOns Sections
const addOnsContainer = document.querySelector(".add-ons");

//addOns Functions
const addOnsContents = function (addOnPackage) {
  const { addsOnPrices, addsOnTypeDetails, addsOnType, planDuration } =
    addOnPackage;
  // console.log(addOnPackage, addOnPackage.planPrices[0]);
  const addOnsHtml = addsOnType
    .map(
      (type, id) => `
     <label for="${type}">
              <div class="add-ons-type">
                <input type="checkbox" name="${type}" id="${type}" value="${type}">
                <div>
                  <p>${type}</p>
                  <span> ${addsOnTypeDetails[id]}</span>
                </div>
              </div>

              <div class="add-ons-price">+$${addsOnPrices[id]}/${planDuration}</div>
            </label>
    `
    )
    .join("");
  return addOnsHtml;
};

//Initialzing the addOnsContainer
addOnsContainer.innerHTML = addOnsContents(monthly);

const addOnOption = new Set();

//selecting addons
const thePickAddOns = function () {
  const addOns = Array.from(
    document.querySelectorAll(`input[type='checkbox']`)
  );

  const addOnPackage = slider.classList.contains("slider-active")
    ? yearly
    : monthly;

  addOns.forEach(function (addOn) {
    addOn.addEventListener("click", function (e) {
      let checkedAddon = e.currentTarget;
      let value = checkedAddon.value;

      if (checkedAddon.checked) {
        addOnOption.add(value); // Add value to the Set if checked
      } else {
        addOnOption.delete(value); // Remove value from the Set if unchecked
      }

      let addonsSummary = Array.from(addOnOption);
      const addOnsResult = addonsSummary
        .map(function (result) {
          // Find the correct index of the add-on to get the price
          const addOnIndex = addOnPackage.addsOnType.indexOf(result);
          const price = addOnPackage.addsOnPrices[addOnIndex];

          return ` <div class="addOns-type">
                    <span class="addOn-type">${result}</span>
                    <span class="addOn-price">+$${price}/${addOnPackage.planDuration}</span>
                  </div>`;
        })
        .join("");
      addOnSummary.innerHTML = addOnsResult;
    });
  });
};

//initalization
thePickAddOns();

//Work on the add ons section
// Total Price
// create a function

//The thank you section

//Rector HTML code
// Refactor CSS code

// Duration Type
slider.addEventListener("click", () => {
  addOnOption.clear();
  addOnSummary.innerHTML = "";
  // thePickAddOns(); to clear the addon summary part
  slider.classList.toggle("slider-active");
  yearBtn.classList.toggle("active-plan");
  monthBtn.classList.toggle("active-plan");

  if (yearBtn.classList.contains("active-plan")) {
    planInput[0].checked = true;
    price = 90;
    planSummaryDetails.innerHTML = updatePlan(yearly, "0");
    addOnsContainer.innerHTML = addOnsContents(yearly);
    planPrices.forEach((price, id) => {
      price.textContent = `+$${yearly.planPrices[id]}/${yearly.planDuration}`;
    });
  } else if (monthBtn.classList.contains("active-plan")) {
    planInput[0].checked = true;
    price = 9;
    planSummaryDetails.innerHTML = updatePlan(monthly, "0");
    addOnsContainer.innerHTML = addOnsContents(monthly);
    planPrices.forEach((price, id) => {
      price.textContent = `+$${monthly.planPrices[id]}/${monthly.planDuration}`;
    });
  }
  thePickAddOns();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("change-plan")) {
    pages[state.currentStep].classList.add("hidden");
    sidebarBtn[state.currentStep].classList.remove("active");
    state.currentStep = 1;

    if (pages[state.currentStep].classList.contains("hidden")) {
      pages[state.currentStep].classList.remove("hidden");
      sidebarBtn[state.currentStep].classList.add("active");
    }

    prevBtn.classList.remove("hide-el");
    nextBtn.textContent = "Next Step";
  }
});

const updateTotalPrice = function () {
  const totalElement = document.querySelector(".total-price");
  if (!totalElement) return;

  const addOnPackage = state.selectedPlan.type === "yearly" ? yearly : monthly;
  let total = state.selectedPlan.price;

  state.addOns.forEach((addOn) => {
    const index = addOnPackage.addsOnType.indexOf(addOn);
    total += addOnPackage.addsOnPrices[index];
  });

  const duration = state.selectedPlan.type === "yearly" ? "yr" : "mo";
  totalElement.innerHTML = `
    <span>Total (per ${
      state.selectedPlan.type === "yearly" ? "year" : "month"
    })</span>
    <span class="total-amount">$${total}/${duration}</span>
  `;
};

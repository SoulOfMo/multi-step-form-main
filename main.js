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

const state = {
  currentStep: 0,
  selectedPlan: {
    type: "monthly",
    price: 9,
    index: 0,
  },
  addOns: new Set(),
};

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
  () => state.currentStep == 0 && prevBtn.classList.add("hide-el")
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

  let allValid = true;

  if (state.currentStep === 0) {
    const inputs = pages[0].querySelectorAll("input[required]");

    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        allValid = false;
        input.parentElement.classList.add("error");
        const errMsg = input.parentElement.querySelector(".err-msg");
        errMsg.textContent = "This field is required";

        setTimeout(() => {
          input.parentElement.classList.remove("error");
        }, "3000");
      }
    });
  }

  if (state.currentStep === 3) {
    pages[state.currentStep].classList.add("hidden");
    pages[4].classList.remove("hidden");
    nav.classList.add("hide-navbtn");
    return;
  }

  ///localstroage here

  if (allValid) {
    pages[state.currentStep].classList.add("hidden");
    sidebarBtn[state.currentStep].classList.remove("active");

    state.currentStep < 3 && state.currentStep++;

    state.currentStep > 0 && prevBtn.classList.remove("hide-el");
    state.currentStep === 3 && (nextBtn.textContent = "Confirm");

    if (pages[state.currentStep].classList.contains("hidden")) {
      pages[state.currentStep].classList.remove("hidden");
      sidebarBtn[state.currentStep].classList.add("active");
    }
  }
});

prevBtn.addEventListener("click", function () {
  pages[state.currentStep].classList.add("hidden");
  sidebarBtn[state.currentStep].classList.remove("active");
  state.currentStep === 0 ? (state.currentStep = 0) : state.currentStep--;
  state.currentStep === 0 && prevBtn.classList.add("hide-el");

  if (state.currentStep < 3) {
    nextBtn.textContent = "Next Step";
  }

  if (pages[state.currentStep].classList.contains("hidden")) {
    pages[state.currentStep].classList.remove("hidden");
    sidebarBtn[state.currentStep].classList.add("active");
  }
});

//Updating the plan picked UI in the summary
const updatePlan = function (plan, index) {
  state.selectedPlan = {
    type: slider.classList.contains("slider-active") ? "yearly" : "monthly",
    plan: plan.planType[index],
    price: plan.planPrices[index],
    index: index,
  };

  return `<div>
              <div class="plan-summary">
                <span class="plan-picked">${plan.planType[index]}</span>
                <span class="plan-duration-summary">(${plan.planName})</span>
              </div>
              <span class="change-plan">Change</span>
            </div>
            <div class="plan-picked-price">$${plan.planPrices[index]}/${plan.planDuration}</div>
          </div>`;
};

planSummaryDetails.innerHTML = updatePlan(monthly, 0);

planInput.forEach((planInp, id) => {
  planInp.addEventListener("change", function () {
    const durationType = slider.classList.contains("slider-active");
    state.selectedPlan.price = durationType
      ? yearly.planPrices[id]
      : monthly.planPrices[id];
    const planChoose = durationType
      ? updatePlan(yearly, id)
      : updatePlan(monthly, id);
    planSummaryDetails.innerHTML = planChoose;
    updateTotalPrice();
  });
});

// AddOns Sections
const addOnsContainer = document.querySelector(".add-ons");

//addOns Functions
const addOnsContents = function (addOnPackage) {
  const { addsOnPrices, addsOnTypeDetails, addsOnType, planDuration } =
    addOnPackage;

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
        state.addOns.add(value);
      } else {
        state.addOns.delete(value);
      }

      updateAddOnsSummary(addOnPackage);
      updateTotalPrice();
    });
  });
};

const updateAddOnsSummary = function (addOnPackage) {
  const addonsSummary = Array.from(state.addOns);

  const addOnsResult = addonsSummary
    .map(function (result) {
      const addOnIndex = addOnPackage.addsOnType.indexOf(result);
      const price = addOnPackage.addsOnPrices[addOnIndex];

      return `<div class="addOns-type">
              <span class="addOn-type">${result}</span>
              <span class="addOn-price">+$${price}/${addOnPackage.planDuration}</span>
            </div>`;
    })
    .join("");

  addOnSummary.innerHTML = addOnsResult;
};

//initalization
thePickAddOns();

//Rector HTML code
// Refactor CSS code

// Duration Type
slider.addEventListener("click", () => {
  state.addOns.clear();
  addOnSummary.innerHTML = "";

  slider.classList.toggle("slider-active");
  yearBtn.classList.toggle("active-plan");
  monthBtn.classList.toggle("active-plan");

  const isYearly = yearBtn.classList.contains("active-plan");
  const plan = isYearly ? yearly : monthly;

  planInput[state.selectedPlan.index].checked = true;

  planPrices.forEach((priceElement, id) => {
    priceElement.textContent = `+$${plan.planPrices[id]}/${plan.planDuration}`;
  });

  addOnsContainer.innerHTML = addOnsContents(plan);
  planSummaryDetails.innerHTML = updatePlan(plan, state.selectedPlan.index);

  thePickAddOns();
  updateTotalPrice();
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

// Call this function whenever prices or selections change
// (after plan changes, add-on changes, etc.)

//// SELECTING ELEMENT
"use strict";

const toggle = document.querySelector(".toggle"),
  slider = document.querySelector(".slider"),
  monthlyPlan = document.querySelector(".month-plan"),
  yearlyPlan = document.querySelector(".year-plan"),
  pages = document.querySelectorAll(".page"),
  sidebarBtn = document.querySelectorAll(".btn"),
  prevBtn = document.querySelector(".prevBtn"),
  nextBtn = document.querySelector(".nextBtn"),
  plans = document.querySelectorAll(".plan"),
  planPrice = document.querySelectorAll(".plan-prices"),
  addOnsPrice = document.querySelectorAll(".add-ons-price"),
  planInput = document.querySelectorAll("input[type='radio']"),
  planPicked = document.querySelector(".plan-picked"),
  planDurationSummary = document.querySelector(".plan-duration-summary"),
  changePlan = document.querySelector(".change-plan"),
  planPickedPrice = document.querySelector(".plan-picked-price"),
  addOns = document.querySelectorAll(`input[type='checkbox']`),
  addOnSummary = document.querySelector(".addOns-picked");
console.log(planInput);

//// Setting default value
let currentState = 0;
const monthly = {
  planDuration: "mo",
  planPrices: [9, 12, 15],
  addsOnprices: [1, 2, 2],
};

const yearly = {
  planDuration: "yr",
  planPrices: [90, 120, 150],
  addsOnprices: [10, 20, 20],
};
planDurationSummary.textContent = `(Monthly)`;

//Checking for the plan type selected
planInput.forEach(function (planInp) {
  planInp.addEventListener("change", function () {
    if (this.checked) {
      let paragraph = this.parentElement.querySelector("p").textContent;
      let price = this.parentElement.querySelector(".plan-prices").textContent;
      console.log(price);
      // let ddd = this.parentElement
      // console.log(ddd);
      // console.log(paragraph);
      // console.log(planPicked);
      planPicked.textContent = `${paragraph}`;
      planPickedPrice.textContent = price;
    }
  });
});

const demo = new Set();
///checking for the addons selected
console.log(addOns);
addOns.forEach(function (addOn) {
  addOn.addEventListener("click", function (e) {
    let checkedAddon = e.currentTarget;
    let value = checkedAddon.value;
    if (checkedAddon.checked) {
      demo.add(value); // Add value to the Set if checked
    } else {
      demo.delete(value); // Remove value from the Set if unchecked
    }
    
    let addonsSummary = Array.from(demo);
    
    const addOnsResult = addonsSummary.map(function(result){
      return ` <div class="addOns-type">
              <span class="addOn-type">${result}</span>
              <span class="addOn-price"></span>
            </div>`;
    }).join('')

    addOnSummary.innerHTML = addOnsResult
    console.log(checkedAddon, demo);
    console.log(addOnsResult );
   ;

    // if (this.checked) {
    //   console.log(addOn);
    //   demo.add(addOn);
    //   console.log(demo);
    // } else
    // {
    //   demo.delete(addOn)
    // }
  });
});

// if ((currentState = 0)) {
//   console.log(prevBtn, currentState);
//   prevBtn.textContent = "";
// } else {
//   prevBtn.textContent = "Go back";
// }

//Changing the plan duration
// function plan duration information

// function planDuration(durationType) {
//    planPrice.forEach((price, index) => {
//      price.textContent = `$${durationType.planPrices[index]} / `;
//      addOnsPrice.forEach((price, index) => {
//        price.textContent = `+$${yearly.addsOnprices[index]}/`;
//      });
//    });
// }

// console.log(planDuration(monthly));

slider.addEventListener("click", () => {
  slider.classList.toggle("slider-active");
  yearlyPlan.classList.toggle("act");
  monthlyPlan.classList.toggle("act");

  if (yearlyPlan.classList.contains("act")) {
    planPrice.forEach((price, index) => {
      price.textContent = `$${yearly.planPrices[index]}/yr`;
      // console.log(price);
      addOnsPrice.forEach((price, index) => {
        price.textContent = `+$${yearly.addsOnprices[index]}/yr`;
      });
    });
    planDurationSummary.textContent = `(Yearly)`;
    console.log(planDurationSummary);
  } else if (monthlyPlan.classList.contains("act")) {
    planPrice.forEach((price, index) => {
      price.textContent = `$${monthly.planPrices[index]}/mo`;
      // console.log(price);
      addOnsPrice.forEach((price, index) => {
        price.textContent = `+$${monthly.addsOnprices[index]}/mo`;
        // console.log(price);
      });
    });
    planDurationSummary.textContent = `(Monthly)`;
    console.log(planDurationSummary);
  }
});

// checking which input is checked

nextBtn.addEventListener("click", function () {
  pages[currentState].classList.add("hidden");
  sidebarBtn[currentState].classList.remove("active");
  currentState++;

  // console.log("okay", currentState);
  if (pages[currentState].classList.contains("hidden")) {
    pages[currentState].classList.remove("hidden");
    sidebarBtn[currentState].classList.add("active");
  }
});

prevBtn.addEventListener("click", function () {
  pages[currentState].classList.add("hidden");
  sidebarBtn[currentState].classList.remove("active");
  currentState--;

  if (pages[currentState].classList.contains("hidden")) {
    pages[currentState].classList.remove("hidden");
    sidebarBtn[currentState].classList.add("active");
  }
});

// Changing Plan type

changePlan.addEventListener("click", function () {
  pages[currentState].classList.add("hidden");
  sidebarBtn[currentState].classList.remove("active");
  currentState = 1;
  if (pages[currentState].classList.contains("hidden")) {
    pages[currentState].classList.remove("hidden");
    sidebarBtn[currentState].classList.add("active");
  }
});

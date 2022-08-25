//currentFocus, used in the autocomplete dropdown
let currentFocus = -1;
const dropdown = document.querySelector(".dropdown");
const input = document.querySelector(".input-text");
const submitBtn = document.querySelector(".submit-btn");

export const changeCurrentFocus = (newValue) => {
  currentFocus = newValue;
};

//!When user types in to the input field, getSearches and open the dropdown results

export const getDropdown = (e) => {
  console.log("dropdown obtained");
  if (![37, 38, 39, 40, 13].includes(e.keyCode)) {
    let results = [];
    //get inputVal from the field
    let inputVal = e.target.value;
    //**** Since we calling API, we don't need this block below//
    //   if (inputVal.length > 0) {
    //     results = searches.filter((item) => {
    //       return item.toLowerCase().includes(inputVal.toLowerCase());
    //     });
    //   }
    if (inputVal.length > 0) {
      const lowerCase = inputVal.toLowerCase();
      getSearches(lowerCase).then(function (value) {
        results = value;
        renderResults(results);
      });
    }
  }
};
//! User can use arrow keys to navigate dropdown results. Add an 'Active' class to the selected result. Enter will simulate a click. Escape closes the dropdown
export const navigateDropdown = (e) => {
  let results;
  //if there is a dropdown, get the dropdown results
  if (dropdown.classList.contains("show")) {
    results = document.querySelectorAll(".dropdown-results");
    // console.log("The results are: ");
    // console.log(results);
  }

  //if down arrow key pressed
  if (e.keyCode == 40) {
    currentFocus++;

    addActive(results);
  }
  //if up arrow key pressed
  else if (e.keyCode == 38) {
    currentFocus--;
    addActive(results);
  }
  //if enter key is pressed
  else if (e.keyCode == 13) {
    e.preventDefault();

    //if user has already selected and there is no more dropdown, submit the item
    if (!dropdown.classList.contains("show")) {
      submitBtn.click();
    }
    if (currentFocus > -1) {
      //simulate a click on the "active" item
      if (results) {
        results[currentFocus].click();
      }
    }
  }
};

//the async keyword makes the function return a promise
const getSearches = async (userInput) => {
  const response = await fetch(
    `https://api.frontendeval.com/fake/food/${userInput}`
  );

  const searches = await response.json();
  return searches;
};

//this functions adds focus to each item when selected in the dropdown
const addActive = (results) => {
  if (!results) return false;
  //start by removing all "active" class on all items
  results.forEach((result) => {
    result.classList.remove("active");
  });
  //allow user to cycle up or down
  if (currentFocus >= results.length) {
    currentFocus = 0;
  }
  if (currentFocus < 0) {
    currentFocus = results.length - 1;
  }

  //add "active" class to the currentFocus
  results[currentFocus].classList.add("active");
};

//!------Render Autocomplete Results-------------------
function renderResults(results) {
  const dropdown = document.querySelector(".dropdown");
  if (!results.length) {
    dropdown.classList.remove("show");
    return;
  }
  //for each item in the results array, map it to a HTML element and then plug it into the DOM (to show in dropdown)
  //Similar to the createListItem, but instead of AppendChild we use "=".
  //This is different because the dropdown constantly changes completely whenever user types
  //But When we createListItem, we want each created items to stay
  let content = results
    .map((item) => {
      return `<li class="dropdown-results">${item}</li>`;
    })
    .join("");

  dropdown.classList.add("show");
  //plug it back into the DOM
  dropdown.innerHTML = `<ul>${content}<ul>`;
  //*Add event listeners to the results
  const items = document.querySelectorAll(".dropdown-results");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      selectItem(item.innerHTML);
    });
  });
}

//When user clicks the result
function selectItem(item) {
  input.value = item;
  //close the dropdown
  dropdown.classList.remove("show");
  //put the focus on the input field, so you press enter then will submit the item
  input.focus();
}

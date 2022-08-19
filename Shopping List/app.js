//This is like the usual grocery list app
//extra functions: checkbox to cross out?
//Autocomplete
//There is a autocomplete pretty good code by Coding Nepal(bookmarked)

//the async keyword makes the function return a promise
//Test blah
const getSearches = async (userInput) => {
  const response = await fetch(
    `https://api.frontendeval.com/fake/food/${userInput}`
  );

  const searches = await response.json();
  return searches;
};

const input = document.querySelector(".input-text");
const submitBtn = document.querySelector(".submit-btn");
const dropdown = document.querySelector(".dropdown");

//This is the direct parent element in the DOM containing all the items in the list
const itemContainer = document.querySelector(".item-container");
//edit
let editFlag = false;
let editID = "";
//currentFocus, used in the autocomplete dropdown
let currentFocus = -1;
//******---------Event Listeners ************/
submitBtn.addEventListener("click", addItem);
//load items
window.addEventListener("DOMContentLoaded", setupItems);

//!When user types in to the input field, getSearches and open the dropdown results
input.addEventListener("keyup", (e) => {
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
});
//! User can use arrow keys to navigate dropdown results. Add an 'Active' class to the selected result
input.addEventListener("keydown", (e) => {
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
});
//this functions adds focus to each item when selected in the dropdown
function addActive(results) {
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
  //   console.log("active");
}

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
      return `<li class="dropdown-results" onclick="selectItem(this)">${item}</li>`;
    })
    .join("");

  dropdown.classList.add("show");
  //plug it back into the DOM
  dropdown.innerHTML = `<ul>${content}<ul>`;
  //   console.log("results rendered again");
}
//When user clicks the result
function selectItem(e) {
  const item = e.innerHTML;
  input.value = item;
  //close the dropdown
  dropdown.classList.remove("show");
  //put the focus on the input field, so you press enter then will submit the item
  input.focus();
}

function addItem(e) {
  //we get the input, createELement, display it in html using element.innerHTML
  e.preventDefault();
  //get name of the item
  const item = input.value;
  const id = new Date().getTime().toString();
  if (item && !editFlag) {
    createListItem(id, item);
    addToLocalStorage(id, item);
    setBackToDefault();
  }
}

function createListItem(id, item) {
  const element = document.createElement("div");
  //add class
  element.classList.add("item");
  //add id to element dataset attribute. Needed to identify the item, in case there is two same name items
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);

  element.innerHTML = `<div class="left">
  <div class="check">
    <i class="fa-thin fa-square"></i>
  </div>
  <div class="name">${item}</div>
</div>
<div class="buttons">
  <div class="edit-btn">
    <i class="fa-solid fa-pen-to-square"></i>
  </div>
  <div class="delete-btn"><i class="fa-solid fa-trash"></i></div>
</div>`;

  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  itemContainer.appendChild(element);
}

function deleteItem(e) {
  //delete from DOM
  const item = e.currentTarget.parentElement.parentElement;
  itemContainer.removeChild(item);

  // remove it from LocalStorage
  const id = item.dataset.id;
  removeFromLocalStorage(id);
}
function editItem(e) {}

function setBackToDefault() {
  input.value = "";
  dropdown.classList.remove("show");
}
function addToLocalStorage(id, item) {
  const newItem = { id: id, name: item };
  //check if array exists. If exists, get that array. If not, get an empty array
  let items = localStorage.getItem("myList")
    ? JSON.parse(localStorage.getItem("myList"))
    : [];
  items.push(newItem);
  localStorage.setItem("myList", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    return item.id !== id;
  });
  console.log(items);
  localStorage.setItem("myList", JSON.stringify(items));
}
function setupItems() {
  const localItems = JSON.parse(localStorage.getItem("myList"));
  if (localItems.length > 0) {
    localItems.forEach((item) => {
      createListItem(item.id, item.name);
    });
  }
}
function editLocalStorage() {}
function getLocalStorage() {
  return localStorage.getItem("myList")
    ? JSON.parse(localStorage.getItem("myList"))
    : [];
}

//?What I learnt from this:
//got better at writing syntax for almost everything in JS... localStorage methods, array filters, DOM traversing

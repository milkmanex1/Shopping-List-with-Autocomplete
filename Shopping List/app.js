import {
  getDropdown,
  navigateDropdown,
  changeCurrentFocus,
} from "./autocomplete.js";

//This is like the usual grocery list app
//extra functions: checkbox to cross out?
//Autocomplete
//There is a autocomplete pretty good code by Coding Nepal(bookmarked)
//the async keyword makes the function return a promise

const input = document.querySelector(".input-text");
const submitBtn = document.querySelector(".submit-btn");
const dropdown = document.querySelector(".dropdown");
const clearBtn = document.querySelector(".clear-btn");

//This is the direct parent element in the DOM containing all the items in the list
const itemContainer = document.querySelector(".item-container");
//edit
let editFlag = false;
let editID = "";
let editElement;

//******---------Event Listeners ************/
submitBtn.addEventListener("click", addItem);
//load items
window.addEventListener("DOMContentLoaded", setupItems);
//clear Items
clearBtn.addEventListener("click", clearItems);

//!When user types in to the input field, getSearches and open the dropdown results
input.addEventListener("keyup", (e) => {
  //getDropdown(e);
  getDebounceDropdown(e);
});
//! User can use arrow keys to navigate dropdown results. Add an 'Active' class to the selected result. Enter will simulate a click.
input.addEventListener("keydown", (e) => {
  if (dropdown.classList.contains("show")) {
    navigateDropdown(e);
  }
});

//**--------------------------------End of autocomplete functions--------------------------------

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
  if (item && editFlag) {
    editElement.innerHTML = item;
    editLocalStorage(editID, item);
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
    <i class="fa-solid fa-pen-to-square" title="edit"></i>
  </div>
  <div class="delete-btn"><i class="fa-solid fa-trash" title="delete"></i></div>
  
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
function editItem(e) {
  //this element has the data-id property
  const item = e.currentTarget.parentElement.parentElement;
  const itemName = item.firstElementChild.lastElementChild.innerHTML;
  //this element just has the name of the item
  editElement = item.firstElementChild.lastElementChild;

  //write the itemName on the input field
  input.value = itemName;
  input.focus();
  editFlag = true;
  editID = item.dataset.id;

  submitBtn.textContent = "edit";
}
function editQuantity(e) {}
function clearItems() {
  //remove the items in DOM
  itemContainer.innerHTML = "";
  //remove the items in localStorage
  localStorage.removeItem("myList");
}
function setBackToDefault() {
  input.value = "";
  dropdown.classList.remove("show");
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
  changeCurrentFocus(-1);
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
function editLocalStorage(id, newItem) {
  let items = getLocalStorage();
  //if id matches, change the item to the newItem
  items = items.map((item) => {
    if (item.id === id) {
      item.value = newItem;
    }
    return item;
  });
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
  if (localItems?.length > 0) {
    localItems.forEach((item) => {
      createListItem(item.id, item.name);
    });
  }
}
function getLocalStorage() {
  return localStorage.getItem("myList")
    ? JSON.parse(localStorage.getItem("myList"))
    : [];
}

const getDebounceDropdown = debounce((e) => {
  getDropdown(e);
});

function debounce(callback, delay = 1000) {
  let timeout;
  return (...args) => {
    //clear timeout each time i call this function
    clearTimeout(timeout);
    //create a new timeout
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

//?What I learnt from this:
//got better at writing syntax for almost everything in JS... localStorage methods, array filters, DOM traversing

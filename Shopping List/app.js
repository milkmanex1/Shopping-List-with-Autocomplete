import { getDropdown, navigateDropdown } from "./autocomplete.js";

//This is like the usual grocery list app
//extra functions: checkbox to cross out?
//Autocomplete
//There is a autocomplete pretty good code by Coding Nepal(bookmarked)
//the async keyword makes the function return a promise

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
  getDropdown(e);
});
//! User can use arrow keys to navigate dropdown results. Add an 'Active' class to the selected result. Enter will simulate a click.
input.addEventListener("keydown", (e) => {
  navigateDropdown(e);
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
  if (localItems?.length > 0) {
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

import returnIcon from "../../icons.js";
import { addTask } from "../../firebase.js";
import { getContacts } from "../../firebase.js";
import { getInitialsFromName } from "../../utility-functions.js";

let users;
let selectedContactsArray = [];

document.addEventListener("DOMContentLoaded", async () => {
  users = await getContacts();
  await renderTaskTemplate();
  await getAddTaskTemplate();

  // Kontaktliste anzeigen
  const assignedContainer = document.querySelector(".assigned-container");
  const userDropdown = document.getElementById("user-dropdown");
  const selectedContact = document.getElementById("selected-contact");

  assignedContainer.addEventListener("click", () => {
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
    userDropdown.style.display = userDropdown.style.display === "none" ? "block" : "none";
  });

  userDropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      selectedContact.value = item.getAttribute("data-user");
    });
  });
  const priorityButtons = document.querySelectorAll(".priority-buttons button");
  const mediumButton = document.querySelector(".button-medium");
  mediumButton.classList.add("active"); 
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      priorityButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  // Datum anzeigen
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("input-container-date").value = "YY";
  document.getElementById("input-container-date").min = today;

  const categoryContainer = document.querySelector(".category-input");
  const categoryDropdown = document.getElementById("category-dropdown");
  const categoryInput = document.getElementById("category");

  categoryContainer.addEventListener("click", () => {
    categoryDropdown.style.display = categoryDropdown.style.display === "block" ? "none" : "block";
  });

  categoryDropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      categoryInput.value = item.getAttribute("data-category");
    });
  });
});
async function renderTaskTemplate() {
  const taskSectionRef = document.querySelector(".content");
  taskSectionRef.innerHTML = /*html*/ `
        <div class="task-content"></div>
    `;
}

export async function getAddTaskTemplate() {
  const addTaskRef = document.querySelector(".task-content");
  addTaskRef.innerHTML += /*html*/ `
        <div class="main-content">
            <h1>Add Task</h1>
            <div class="input-container">
                <div class="input-left">
                    <div class="title-input">
                        <h2>Title<span>*</span>
                        </h2>
                        <input type="text" name="title" class="title-container" id="input-container-title" placeholder="Enter a title"/>
                        <div class="request-container">
                            <p id="title-requested" >Dieses Feld muss ausgefüllt werden</p>
                        </div>
                    </div>
                      <div class="description-input">
                        <h2>Description</h2>
                        <textarea type="text" name="description" class="description-container" placeholder="Enter a description" rows="5"></textarea>
                      </div>
                      <div class="assigned-input">
                        <h2>Assigned to</h2>
                        <div class="assigned">
                         <input type="text" name="assigned" class="assigned-container" id="selected-contact" placeholder="Select contacts to assign" readonly />
                         <span id="dropdown-icon">${returnIcon("arrow-dropdown")}</span>
                           <div class="dropdown" id="user-dropdown">
                              <ul id="user-list" data-user="user">
                              </ul>
                           </div>
                        </div>
                        <div id="selected-contacts-display" class="initials-display">
                    </div>
                </div>
                </div>
                <div class="separator"></div>
                <div class="input-right">
                    <div class="date-input">
                        <h2>Due date<span>*</span>
                        </h2>
                        <div class="date" id="date-data">
                        <input type="date" id="input-container-date" name="Date" class="date-container"/>
                        </div>
                        <div class="request-container">
                            <p id="date-requested">Dieses Feld muss ausgefüllt sein</p>
                        </div>
                    </div>
                    <div class="priority">
                        <h2>Prio</h2>
                        <div class="priority-buttons">
                            <button class="button-urgent">Urgent ${returnIcon("urgent")}</button>
                            <button class="button-medium">Medium ${returnIcon("medium")}</button>
                            <button class="button-low">Low ${returnIcon("low")}</button>
                        </div>
                    </div>
                    <div class="category">
                        <h2>Category<span>*</span>
                        </h2>
                        <div class="category-input">
                         <input type="text" name="category" class="category-container" id="category" placeholder="Select task category" readonly />
                         ${returnIcon("arrow-dropdown")}
                          <div class="dropdown" id="category-dropdown">
                            <ul>
                                <li  data-category="Technical Task">Technical Task</li>
                                <li  data-category="Userstory">Userstory</li>
                            </ul>
                         </div>
                        </div>
                        <div class="request-container">
                           <p id="category-requested">Dieses Feld muss ausgefüllt sein</p>
                        </div>
                    </div>
                    <div class="subtasks">
                        <h2>Subtasks</h2>
                          <div class="subtasks-input">
                            <input type="text" name="subtasks" class="subtasks-container" id="subtasks" placeholder="Add new subtask"/>
                            ${returnIcon("plus")}
                          </div>
                          <div class="subtasks-overview" id="subtasks-overview">
                        </div>
                    </div>
                  </div>
            </div>
            <div class="container-bottom">
             <div class="span-content">
                    <span class="span-container">*</span>
                    <span>This field is required</span>
             </div>
             <div class="add-task-button-container">
                    <button id="delete-task-button"  class="clear">Clear ${returnIcon("x")}</button>
                    <button id="create-task-button" class="create">Create task ${returnIcon("check")}</button>
             </div>
            </div>
        </div>
    `;

  const dropdownIcon = document.querySelector("#dropdown-icon");
  const dropdownMenu = document.querySelector("#user-dropdown");
  const userListRef = document.querySelector("#user-list");

  dropdownIcon.addEventListener("click", async () => {
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
      return;
    }

    dropdownMenu.style.display = "block";
    userListRef.innerHTML = "";

    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <label class="label">
         
          <div class="initials-bg" style="background-color: #${user.userColor}">${getInitialsFromName(user.fullName)}</div>  ${user.fullName}
           <input type="checkbox" data-user="${user.fullName}">
        </label>
      `;
      userListRef.appendChild(li);

      const checkbox = li.querySelector("input[type='checkbox']");
      const label = li.querySelector(".label");
      if (selectedContactsArray.some((contact) => contact.id === user.id)) {
        checkbox.checked = true;
        label.classList.add("selected-contact");
      }
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          if (!selectedContactsArray.some((contact) => contact.id === user.id)) {
            selectedContactsArray.push({
              id: user.id,
              name: user.fullName,
              initials: getInitialsFromName(user.fullName),
              color: user.userColor,
            });
          }
          label.classList.add("selected-contact");
        } else {
          selectedContactsArray = selectedContactsArray.filter((contact) => contact.id !== user.id);
          label.classList.remove("selected-contact");
        }
        updateSelectedContactsDisplay();
      });
    });
  });
  function updateSelectedContactsDisplay() {
    const selectedContactsContainer = document.getElementById("selected-contacts-display");
    selectedContactsContainer.innerHTML = "";

    const displayContacts = selectedContactsArray.slice(0, 3);
    const additionalCount = selectedContactsArray.length - displayContacts.length;

    displayContacts.forEach((contact) => {
      selectedContactsContainer.innerHTML += `
      <span class="initials-bg" style="background-color: #${contact.color};">${contact.initials}</span>
    `;
    });

    if (additionalCount > 0) {
      selectedContactsContainer.innerHTML += `
      <span class="additional-users">
        +${additionalCount}
      </span>
    `;
    }
  }

  document.addEventListener("click", (event) => {
    if (!dropdownIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  const priorityButtons = document.querySelectorAll(".priority-buttons button");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      priorityButtons.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");
    });
  });

  document.getElementById("create-task-button").addEventListener("click", () => {
    handleAddTask();
  });

  document.getElementById("delete-task-button").addEventListener("click", () => {
    clearAddTaskForm();
  });

  const subtasksInput = document.getElementById("subtasks");
  const subtasksOverview = document.getElementById("subtasks-overview");
  const addButton = subtasksInput.nextElementSibling;

  let subtasksArray = [];

  addButton.addEventListener("click", () => {
    const subtaskText = subtasksInput.value.trim();

    if (subtaskText !== "") {
      const subtasksObject = { title: subtaskText, checked: false };
      subtasksArray.push(subtasksObject);

      const subtaskContainer = document.createElement("div");
      subtaskContainer.classList.add("subtasks-flex");
      subtaskContainer.id = "subtasks-flex";
      subtaskContainer.style.display = "flex";

      const newSubtask = document.createElement("p");
      newSubtask.textContent = subtaskText;

      const subtaskIcons = document.createElement("div");
      subtaskIcons.classList.add("subtasks-icons");

      const penIcon = document.createElement("span");
      penIcon.innerHTML = returnIcon("pen-outline");
      penIcon.addEventListener("click", () => {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = newSubtask.textContent;
        inputField.classList.add("edit-subtask");

        newSubtask.textContent = "";
        newSubtask.appendChild(inputField);

        inputField.focus();

        inputField.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            newSubtask.textContent = inputField.value;
            subtasksObject.title = inputField.value;
          }
        });

        inputField.addEventListener("blur", () => {
          newSubtask.textContent = inputField.value;
        });
      });

      const trashIcon = document.createElement("span");
      trashIcon.innerHTML = returnIcon("trash-outline");
      trashIcon.addEventListener("click", () => {
        const index = subtasksArray.indexOf(subtasksObject);
        if (index !== -1) {
          subtasksArray.splice(index, 1);
        }
        subtasksOverview.removeChild(subtaskContainer);
      });

      subtaskIcons.appendChild(penIcon);
      subtaskIcons.appendChild(trashIcon);
      subtaskContainer.appendChild(newSubtask);
      subtaskContainer.appendChild(subtaskIcons);
      subtasksOverview.appendChild(subtaskContainer);
      subtasksInput.value = "";
    }
  });
}

async function handleAddTask() {
  const title = document.getElementById("input-container-title").value;
  const description = document.querySelector(".description-container").value;
  const dueDate = document.getElementById("input-container-date").value;

  let assignee = [];

  selectedContactsArray.forEach((contact) => {
    assignee.push(contact.id);
  });

  let subTasks = [];

  const subTasksRefs = document.querySelectorAll(".subtasks-flex p");

  subTasksRefs.forEach((subtask) => {
    subTasks.push(subtask.textContent);
  });

  const priority = document.querySelector(".priority-buttons .button-urgent.active")
    ? "urgent"
    : document.querySelector(".priority-buttons .button-medium.active")
    ? "medium"
    : "low";
  const type = document.getElementById("category").value;
  const slot = undefined;

  if (!validateAddTask(title, dueDate)) {
    console.error(" validierung fehlgeschlagen");
  } else {
    addTask(slot, title, description, type, priority, dueDate, subTasks, assignee);

    clearAddTaskForm();
  }
}

function clearAddTaskForm() {
  document.getElementById("input-container-title").value = "";
  document.querySelector(".description-container").value = "";
  document.getElementById("input-container-date").value = "";
  document.getElementById("selected-contacts-display").innerHTML = "";
  document.getElementById("subtasks").value = "";
  document.getElementById("category").value = "";

  const priorityButtons = document.querySelectorAll(".priority-buttons button");
  priorityButtons.forEach((button) => button.classList.remove("active"));

  const subtasksClearRef = document.querySelector(".subtasks-overview");
  subtasksClearRef.innerHTML = "";
}

function validateAddTask(title, dueDate) {
  const titleRequest = document.getElementById("title-requested");
  const inputTitleRequest = document.getElementById("input-container-title");
  let titleValidation = /^[a-zA-ZäöüÄÖÜß\s-]+$/;
  if (!titleValidation.test(title) || title.length < 5) {
    titleRequest.style.display = "block";
    titleRequest.style.color = "red";
    inputTitleRequest.style.borderColor = "red";
    return false;
  } else {
    titleRequest.style.display = "none";
    inputTitleRequest.style.borderColor = "#d1d1d1";
  }

  const dateRequest = document.getElementById("date-requested");
  const inputDateRequest = document.getElementById("input-container-date");
  let dateValidation = /^\d{4}\-\d{2}\-\d{2}$/;

  if (!dateValidation.test(dueDate)) {
    dateRequest.style.display = "block";
    dateRequest.style.color = "red";
    inputDateRequest.style.borderColor = "red";
    return false;
  } else {
    dateRequest.style.display = "none";
    inputDateRequest.style.borderColor = "#d1d1d1";
  }

  const categoryRequest = document.getElementById("category-requested");
  const inputCategoryRequest = document.getElementById("category");
  let categoryValidation = inputCategoryRequest.value.trim() !== "";

  if (!categoryValidation) {
    categoryRequest.style.display = "block";
    categoryRequest.style.color = "red";
    inputCategoryRequest.style.borderColor = "red";
    return false;
  } else {
    categoryRequest.style.display = "none";
    inputCategoryRequest.style.borderColor = "#d1d1d1";
  }

  return true;
}

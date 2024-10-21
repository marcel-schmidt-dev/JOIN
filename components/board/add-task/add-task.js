import returnIcon from "../../icons.js";
import { addTask } from "../../firebase.js";
import { deleteTask } from "../../firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderTaskTemplate();
  await getAddTaskTemplate();
});

async function renderTaskTemplate() {
  const taskSectionRef = document.querySelector(".content");
  taskSectionRef.innerHTML = /*html*/ `
        <div class="task-content"></div>
    `;
}

async function getAddTaskTemplate() {
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
                         ${returnIcon("arrow-dropdown")}
                          <div class="dropdown" id="user-dropdown">
                              <ul>
                                  <li data-user="Hans">Hans</li>
                                  <li data-user="Fritz">Fritz</li>
                                  <li data-user="Karl">Karl</li>
                              </ul>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="separator"></div>
                <div class="input-right">
                    <div class="date-input">
                        <h2>Due date<span>*</span>
                        </h2>
                        <div class="date">
                         <input type="text" name="date" class="date-container" id="input-container-date" placeholder="dd/mm/yyyy"/>
                         ${returnIcon("calendar")}
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
                                <li  data-category="Technical task">Technical task</li>
                                <li  data-category="Userstory">Userstory</li>
                            </ul>
                         </div>
                        </div>
                    </div>
                    <div class="subtasks">
                        <h2>Subtasks</h2>
                        <div class="subtasks-input">
                         <input type="text" name="subtasks" class="subtasks-container" id="subtasks" placeholder="Add new subtask"/>
                         ${returnIcon("plus")}
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
                    <button id="delete-task-button" class="clear">Clear ${returnIcon("x")}</button>
                    <button id="create-task-button" class="create">Create task ${returnIcon("check")}</button>
             </div>
            </div>
        </div>
    `;

  const priorityButtons = document.querySelectorAll(".priority-buttons button");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      priorityButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  document.getElementById("delete-task-button").addEventListener("click", () => {
    const slot = `board/${slot}`;
    const id = `board/${id}`;
    deleteTask(slot, id);
  });
  document.getElementById("create-task-button").addEventListener("click", handleAddTask);
}

async function handleAddTask() {
  const title = document.getElementById("input-container-title").value;
  const description = document.querySelector(".description-container").value;
  const dueDate = document.getElementById("input-container-date").value;
  const assignee = document.getElementById("selected-contact").value;
  const subTasks = document.getElementById("subtasks").value;
  const priority = document.querySelector(".priority-buttons .button-urgent.active")
    ? "urgent"
    : document.querySelector(".priority-buttons .button-medium.active")
    ? "medium"
    : "low";
  const type = "type";
  const slot = "slot";

  if (!validateAddTask(title, dueDate)) return;

  addTask(slot, title, description, type, priority, dueDate, subTasks, assignee);
}

function validateAddTask(title, dueDate) {
  const titleRequest = document.getElementById("title-requested");
  const inputTitleRequest = document.getElementById("input-container-title");
  let titleValidation = /^[a-zA-ZäöüÄÖÜß\s-]+$/;
  if (!titleValidation.test(title) || title.length < 10) {
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
  let dateValidation = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateValidation.test(dueDate) || dueDate.length < 10 || dueDate.length > 10) {
    dateRequest.style.display = "block";
    dateRequest.style.color = "red";
    inputDateRequest.style.borderColor = "red";
    return false;
  } else {
    dateRequest.style.display = "none";
    inputDateRequest.style.borderColor = "#d1d1d1";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const assignedContainer = document.querySelector(".assigned");
  const userDropdown = document.getElementById("user-dropdown");
  const selectedContact = document.getElementById("selected-contact");

  assignedContainer.addEventListener("click", () => {
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
  });

  userDropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      selectedContact.value = item.getAttribute("data-user");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
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

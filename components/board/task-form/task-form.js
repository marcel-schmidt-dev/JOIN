import { checkAuth, getContacts, addTask, editTask, returnTaskById, getContact } from "./../../firebase.js";
import { returnPath, getInitialsFromName } from "./../../utility-functions.js";
import returnIcon from "../../icons.js";
import { showToast } from "../../toast/toast.js";
import { renderTasks } from "./../board.js";
import { renderBoardTemplate } from "./../board.js";

window.handlePriorityClick = handlePriorityClick;
window.showDatepicker = showDatepicker;
window.renderAssigneeList = renderAssigneeList;
window.clearForm = clearForm;
window.toggleAssigneeInList = toggleAssigneeInList;
window.addSubtask = addSubtask;
window.titleValidation = titleValidation;
window.deleteSubTask = deleteSubtask;
window.editSubtask = editSubtask;
window.saveSubtask = saveSubtask;
window.dateValidation = dateValidation;
window.handleSubmitTask = handleSubmitTask;
window.closeModal = closeModal;
window.categoryValidation = categoryValidation;

let contactList;
let assignedContacts = [];
let subtasks = [];

document.addEventListener("DOMContentLoaded", async () => {
  checkAuth();
  contactList = await getContacts();
  if (returnPath() === "/add-task.html") {
    renderTaskPage();
  }
});

export async function renderTaskForm(slot = "todo", taskId = null) {
  let contentRef;
  let task = null;
  assignedContacts = [];
  subtasks = [];

  if (taskId) {
    task = await returnTaskById(taskId);

    const assigneesPromises = task.assignee.map((id) => getContact(id));
    assignedContacts = await Promise.all(assigneesPromises);

    if (task.subTasks) {
      subtasks = task.subTasks;
    }
  }

  while ((contentRef = document.querySelector(".form-container")) === null) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (contentRef) {
    contentRef.innerHTML = /*html*/ `
            <div class="task-form">
              <h1>${task ? "Edit Task" : "Add Task"}</h1>
              <div class="task-form-container">
                <form id="task-form" onsubmit="handleSubmitTask(event, '${slot}', '${task ? task.id : ""}')">
                  <div>
                    <label for="title">Title<span class="red-star">*</span></label>
                    <input type="text" id="title" name="title" placeholder="Enter a title" value="${task ? task.title : ""}">
                    <div class="request-alert">
                        <p id="request-title" >This field is required</p>
                    </div>
                    <label for="description">Description</label>
                    <textarea id="description" name="description" placeholder="Enter a Description" rows="3">${task ? task.description : ""}</textarea>
                    ${await returnAssigneeInput()}
                    <div class="assignees">
                    </div>
                  </div>
                  <hr />
                  <div>
                    <label for="due-date">Due date<span class="red-star">*</span></label>
                    <input type="date" id="due-date" name="due-date" onClick="showDatepicker()" value="${task ? task.dueDate : ""}">
                    <div class="request-alert">
                        <p id="request-date" >This field is required</p>
                    </div>
                    <label for="priority">Prio</label>
                    <div class="priorities">
                      <button type="button" class="priority ${
                        task ? (task.priority === "urgent" ? "selected" : "") : ""
                      }" onClick="handlePriorityClick(this)" value="urgent">  Urgent ${returnIcon("urgent")}</button>
                      <button type="button" class="priority ${
                        task ? (task.priority === "medium" ? "selected" : "") : "selected"
                      }" onClick="handlePriorityClick(this)" value="medium">Medium ${returnIcon("medium")}</button>
                      <button type="button" class="priority ${
                        task ? (task.priority === "low" ? "selected" : "") : ""
                      }" onClick="handlePriorityClick(this)" value="low">Low ${returnIcon("low")}</button>
                    </div>
                    <label for="category">Category<span class="red-star">*</span></label>
                    <select name="category" id="category" ${task ? "disabled" : ""}>
                      <option value="" disabled ${!task && "selected"}>Select task category</option>
                      <option value="User Story" ${task && task.type === "User Story" ? "selected" : ""}>User Story</option>
                      <option value="Technical Task" ${task && task.type === "Technical Task" ? "selected" : ""}>Technical Task</option>
                    </select>
                    <div class="request-alert">
                        <p id="request-category" >This field is required</p>
                    </div>
                    <label for="Subtasks">Subtasks</label>
                    <div class="input-container">
                      <input type="text" id="subtasks-input" name="" placeholder="Add new subtask"/> 
                      <div class="icon" onclick="addSubtask()">
                        ${returnIcon("plus")}
                      </div>
                    </div>
                    <div class="subtasks"></div> 
                  </div>
                  <div class="footer-buttons">
                    <p><span class="red-star">*</span>This field is required</p>
                    <div class="buttons">
                      <button type="button" onclick="clearForm()" id="clear-form" class="clear-button">Clear ${returnIcon("x")}</button>
                      <button type="submit"  id="submit-task" class="submit-button">${!task ? "Create Task" : "Edit Task"} ${returnIcon("check")} </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
        `;
    renderSubtasks();
    preventEnterKeySubmit();
    renderSelectedAssignees();
    const modalRef = document.querySelector(".modal");
    if (modalRef) modalRef.classList.add("active");
  }
}

function preventEnterKeySubmit() {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
  });
}

function renderTaskPage() {
  const contentRef = document.querySelector(".content");
  contentRef.innerHTML = /*html*/ `<div class="form-container"></div>`;
  renderTaskForm("todo", null);
}

export function renderModal() {
  const contentRef = document.querySelector(".content");
  const modalRef = document.createElement("div");
  modalRef.classList.add("modal");
  modalRef.innerHTML = /*html*/ `
    <div class="modal-content">
      <span class="close" onclick="closeModal()">${returnIcon("x")}</span>
      <div class="form-container"></div>
    </div>
  `;
  contentRef.appendChild(modalRef);
}

function closeModal() {
  const modalRef = document.querySelector(".modal");
  modalRef.classList.remove("active");
  renderBoardTemplate();
}

function clearForm() {
  clearPriority();
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
  assignedContacts = [];
  document.querySelector("#due-date").value = "";
  document.querySelector("#category").value = "";
  document.querySelector("#subtasks-input").value = "";
  subtasks = [];
  document.querySelector(".subtasks").innerHTML = "";
  renderSelectedAssignees();
}

function clearPriority() {
  const buttons = document.querySelectorAll(".priorities .priority");
  buttons.forEach((button) => button.classList.remove("selected"));
  buttons[1].classList.add("selected");
}

function titleValidation(title) {
  const validateTitle = document.querySelector("#request-title");
  const titleContainer = document.querySelector("#title");

  if (title === "" || title.length <= 3) {
    validateTitle.style.display = "block";
    validateTitle.style.color = "red";
    titleContainer.style.borderColor = "red";
    return false;
  } else {
    validateTitle.style.display = "none";
    titleContainer.style.borderColor = "#29abe2";
    return true;
  }
}

function dateValidation(dueDate) {
  const validateDate = document.querySelector("#request-date");
  const dateContainer = document.querySelector("#due-date");

  const dateValidation = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateValidation.test(dueDate)) {
    validateDate.style.display = "block";
    validateDate.style.color = "red";
    dateContainer.style.borderColor = "red";
    return false;
  } else {
    validateDate.style.display = "none";
    dateContainer.style.borderColor = "#29abe2";
    return true;
  }
}

function categoryValidation() {
  const validateCategory = document.querySelector("#request-category");
  const categoryContainer = document.querySelector("#category");
  let categoryValidation = categoryContainer.value.trim() !== "";

  if (!categoryValidation) {
    validateCategory.style.display = "block";
    validateCategory.style.color = "red";
    categoryContainer.style.borderColor = "red";
    return false;
  } else {
    validateCategory.style.display = "none";
    categoryContainer.style.borderColor = "#d1d1d1";
  }

  return true;
}

function handlePriorityClick(element) {
  const priorities = document.querySelectorAll(".priority");
  priorities.forEach((priority) => {
    priority.classList.remove("selected");
  });
  element.classList.add("selected");
}

function showDatepicker() {
  const dueDateRef = document.getElementById("due-date");
  const today = new Date().toISOString().split("T")[0];
  dueDateRef.setAttribute("min", today);
  dueDateRef.showPicker();
}

async function returnAssigneeInput() {
  return /*html*/ `
  <div class="assignee-input">
  <label for="assigned-input">Assigned to</label>
      <input type="text" id="assignee-input" name="assigned-input" placeholder="Select contacts to assign" onClick="renderAssigneeList()" oninput="renderAssigneeList()">
    <div class="assignee-dropdown">
    </div>
  </div>
  `;
}

async function renderAssigneeList() {
  const filterInput = document.getElementById("assignee-input");
  const filteredContacts = contactList.filter((contact) => contact.fullName.toLowerCase().includes(filterInput.value.toLowerCase()));
  filteredContacts.sort((a, b) => a.fullName.localeCompare(b.fullName));
  const assigneeDropdown = document.querySelector(".assignee-dropdown");

  let contactsList = "";

  filteredContacts.forEach((contact) => {
    const isChecked = assignedContacts.find((assignedContact) => assignedContact.id === contact.id);

    contactsList += /*html*/ `
    <div class="assignee ${isChecked ? "selected" : ""}" onClick="toggleAssigneeInList(this)">
      <div class="initials-bubble" style="background-color: #${contact.userColor}">${getInitialsFromName(contact.fullName)} </div>
      <span>${contact.fullName}</span>
      <input ${isChecked && "checked"} type="checkbox" name="assignee" data-id="${contact.id}" data-fullname="${contact.fullName}" data-usercolor="${contact.userColor}" />
  </div>
    `;
  });

  assigneeDropdown.innerHTML = "";
  assigneeDropdown.innerHTML = filteredContacts.length > 0 ? contactsList : "<span>No contacts found</span>";
}

function toggleAssigneeInList(element) {
  const checkBox = element.querySelector("input");

  if (!checkBox.checked) {
    assignedContacts.push({ id: checkBox.dataset.id, fullName: checkBox.dataset.fullname, userColor: checkBox.dataset.usercolor });
    checkBox.checked = true;
    element.classList.add("selected");
  } else {
    assignedContacts = assignedContacts.filter((contact) => contact.id !== checkBox.dataset.id);
    checkBox.checked = false;
    element.classList.remove("selected");
  }

  renderSelectedAssignees();
}

function renderSelectedAssignees() {
  const assignees = document.querySelector(".assignees");
  assignees.innerHTML = "";
  assignedContacts.slice(0, 3).forEach((contact) => {
    assignees.innerHTML += /*html*/ `
      <div class="initials-bubble" style="background-color: #${contact.userColor}" title="${contact.fullName}">${getInitialsFromName(contact.fullName)}</div>
    `;
  });

  if (assignedContacts.length > 3) {
    const remainingContacts = assignedContacts.slice(3);
    const remainingNames = remainingContacts.map((contact) => contact.fullName).join(", ");
    assignees.innerHTML += /*html*/ `
      <div class="initials-bubble" style="background-color: #222" title="${remainingNames}">+${remainingContacts.length}</div>
    `;
  }
}

function addSubtask() {
  const subtaskInput = document.querySelector("#subtasks-input");
  if (subtaskInput.value === "") return;

  subtasks.push({ title: subtaskInput.value, checked: false });
  subtaskInput.value = "";
  renderSubtasks();
}

function renderSubtasks() {
  const subtasksContainer = document.querySelector(".subtasks");
  subtasksContainer.innerHTML = "";

  if (subtasks && subtasks.length > 0) {
    subtasks.forEach((subtask, index) => {
      subtasksContainer.innerHTML += /*html*/ `
        <div class="subtask" data-index="${index}">
          <input type="text" class="subtask-container" value="${subtask.title}"> 
          <div class="buttons">
            <button type="button" onClick="editSubtask(event)">${returnIcon("pen-outline")}</button>
            <button type="button" onmousedown="deleteSubTask(event)">${returnIcon("trash-outline")}</button>
            <button type="button" onmousedown="saveSubtask(event)">${returnIcon("check")}</button>
          </div>
        </div>
      `;
    });
  }
}

function deleteSubtask(event) {
  const subtask = event.target.closest(".subtask");
  const index = subtask.dataset.index;
  subtasks.splice(index, 1);
  renderSubtasks();
}

function editSubtask(event) {
  const subTaskInput = event.target.closest(".subtask").querySelector("input");
  const value = subTaskInput.value;
  subTaskInput.value = "";
  subTaskInput.focus();
  subTaskInput.value = value;
}

function saveSubtask(event) {
  const subtask = event.target.closest(".subtask");
  const index = subtask.dataset.index;

  subtasks[index] = { title: subtask.querySelector("input").value, checked: subtasks[index].checked };
  renderSubtasks();
}

function handleSubmitTask(event, slot, id = "") {
  event.preventDefault();

  const form = event.target;
  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const dueDate = form["due-date"].value.trim();
  const priority = form.querySelector(".priority.selected").value;
  const category = form.category.value;
  const assignees = assignedContacts.map((contact) => contact.id);
  const modal = document.querySelector(".modal");

  const validDate = dateValidation(dueDate);
  const validTitle = titleValidation(title);
  const validCategory = categoryValidation(category);

  if (!validDate || !validTitle || !validCategory) {
    return;
  }

  if (modal) modal.classList.remove("active");

  if (!id) {
    addTask(slot, title, description, category, priority, dueDate, subtasks, assignees);
    showToast("Task added successfully", "check");
  } else {
    editTask(slot, id, title, description, category, priority, dueDate, subtasks, assignees);
    showToast("Task edited successfully", "check");
  }

  renderTasks();
  window.location.href = "/board.html";
}

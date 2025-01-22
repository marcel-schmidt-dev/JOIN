import { checkAuth, getContacts } from "./../../firebase.js";
import { returnPath, getInitialsFromName } from "./../../utility-functions.js";
import returnIcon from "../../icons.js";

window.handlePriorityClick = handlePriorityClick;
window.showDatepicker = showDatepicker;
window.renderAssigneeList = renderAssigneeList;
window.clearForm = clearForm;
window.toggleAssigneeInList = toggleAssigneeInList;
window.clearPriority = clearPriority;

let contactList;
let assignedContacts = [];

document.addEventListener("DOMContentLoaded", async () => {
  checkAuth();
  contactList = await getContacts();
  if (returnPath() === "/add-task.html") {
    renderTaskForm();
  }
});

export async function renderTaskForm(className = ".content", task = null) {
  let contentRef;
  while ((contentRef = document.querySelector(className)) === null) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (contentRef) {
    contentRef.innerHTML = /*html*/ `
            <div class="task-form">
            <h1>${task ? "Edit Task" : "Add Task"}</h1>
              <div class="task-form-container">
              <form id="task-form">
              <div>
                <label for="title">Title <span class="red-star">*</span></label>
                <input type="text" id="title" name="title" placeholder="Enter a title" required>
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Enter a Description" rows="3"></textarea>
                ${await returnAssigneeInput()}
                <div class="assignees"></div>
              </div>
              <hr />
              <div>
                <label for="due-date">Due date <span class="red-star">*</span></label>
                <input type="date" id="due-date" name="due-date" onClick="showDatepicker()" required>
                <label for="priority">Prio</label>
                <div class="priorities">
                  <button type="button" class="priority" onClick="handlePriorityClick(this)" value="urgent">Urgent ${returnIcon("urgent")}</button>
                  <button type="button" class="priority selected" onClick="handlePriorityClick(this)" value="medium">Medium ${returnIcon("medium")}</button>
                  <button type="button" class="priority" onClick="handlePriorityClick(this)" value="low">Low ${returnIcon("low")}</button>
                </div>
                <label for="category">Category <span class="red-star">*</span></label>
                <select name="category" id="category">
                  <option value="" disabled selected>Select task category</option>
                  <option value="User Story">User Story</option>
                  <option value="Technical Task">Technical Task</option>
                </select>
                <label for="Subtasks">Subtasks</label>
                <!-- TODO: Custom Input Field -->
                <div class="input-container">
                <input type="text" id="subtasks-input" name="" placeholder="Add new subtask"/> 
                <div class="icon">
                ${returnIcon("plus")}
                </div>
                </div>
                 <div class="subtasks"></div> 
              </div>
              </div>
              <div class="footer-buttons">
                  <p><span class="red-star">*</span>This field is required</p>
                  <div class="buttons">
                  <button type="button" onclick="clearForm(); clearPriority()" id="clear-form" class="clear-button">Clear ${returnIcon("x")}</button>
                  <button type="submit" id="submit-task" class="submit-button">Create Task ${returnIcon("check")}</button>
                  </div>
               </div>
            </form>
            </div>
        `;
  }
}

function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
  assignedContacts = [];
  document.querySelector("#due-date").value = "";
  document.querySelector("#category").value = "";
  document.querySelector("#subtasks-input").value = "";

  renderSelectedAssignees();
}

function clearPriority() {
  const buttons = document.querySelectorAll(".priorities .priority");
  buttons.forEach((button) => button.classList.remove("selected"));
  buttons[1].classList.add("selected");
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
    <div class="assignee ${isChecked && "selected"}" onClick="toggleAssigneeInList(this)">
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
  assignedContacts.forEach((contact) => {
    assignees.innerHTML += /*html*/ `
      <div class="initials-bubble" style="background-color: #${contact.userColor}" title="${contact.fullName}">${getInitialsFromName(contact.fullName)}</div>
    `;
  });
}

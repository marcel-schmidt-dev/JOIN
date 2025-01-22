import { checkAuth, getContacts } from "./../../firebase.js";
import { returnPath, getInitialsFromName } from "./../../utility-functions.js";
import returnIcon from "../../icons.js";

window.handlePriorityClick = handlePriorityClick;
window.showDatepicker = showDatepicker;
window.renderAssigneeList = renderAssigneeList;

document.addEventListener("DOMContentLoaded", async () => {
  checkAuth();

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
                <label for="title">Title</label>
                <input type="text" id="title" name="title" placeholder="Enter a title" required>
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Enter a Description" rows="3"></textarea>
                ${await returnAssigneeInput()}
                <div class="assignees"></div>
              </div>
              <hr />
              <div>
                <label for="due-date">Due date</label>
                <input type="date" id="due-date" name="due-date" onClick="showDatepicker()" required>
                <label for="priority">Prio</label>
                <div class="priorities">
                  <button type="button" class="priority" onClick="handlePriorityClick(this)" value="urgent">Urgent ${returnIcon("urgent")}</button>
                  <button type="button" class="priority selected" onClick="handlePriorityClick(this)" value="medium">Medium ${returnIcon("medium")}</button>
                  <button type="button" class="priority" onClick="handlePriorityClick(this)" value="low">Low ${returnIcon("low")}</button>
                </div>
                <label for="category">Category</label>
                <select name="category" id="category">
                  <option value="User Story">User Story</option>
                  <option value="Technical Task">Technical Task</option>
                </select>
                <label for="Subtasks">Subtasks</label>
                <!-- TODO: Custom Input Field -->
                <div class="subtasks-container">
                <input type="text" id="subtasks-input" name="" placeholder="Add new subtask"/> 
                <div class="icon">
                ${returnIcon("plus")}
                </div>
                </div>
                 <div class="subtasks"></div> 
              </div>
              </div>
              <div class="footer-buttons">
                  <span>This field is required</span>
                  <div class="buttons">
                  <button type="button" id="clear-form" class="clear-button">Clear ${returnIcon("x")}</button>
                  <button type="submit" id="submit-task" class="submit-button">Create Task ${returnIcon("check")}</button>
                  </div>
               </div>
            </form>
            </div>
        `;
  }
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
    <input type="text" id="assignee-input" name="assigned-input" placeholder="Select contacts to assign" onClick="renderAssigneeList()">
    <div class="assignee-dropdown">
    </div>
  </div>
  `;
}

async function renderAssigneeList() {
  const contacts = await getContacts();
  const filterInput = document.getElementById("assignee-input");
  const filteredContacts = contacts.filter((contact) => contact.fullName.toLowerCase().includes(filterInput.value.toLowerCase()));

  let contactsList = "";
  filteredContacts.sort((a, b) => a.fullName.localeCompare(b.fullName));
  const assigneeDropdown = document.querySelector(".assignee-dropdown");

  filteredContacts.forEach((contact) => {
    contactsList += /*html*/ `
    <div class="assignee">
      <div class="initials-bubble" style="background-color: #${filteredContacts.userColor}">${getInitialsFromName(filteredContacts.fullName)}</div>
      <span>${contact.fullName}</span>
      <input type="checkbox" name="assignee" value="${filteredContacts.id}">
    </div>
    `;
  });

  assigneeDropdown.innerHTML = contactsList;
}

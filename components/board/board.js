import { returnBoard, moveTaskToSlot, updateSubTaskStatus } from "../firebase.js";
import { returnTaskTemplate } from "./task-card/task-card.js";
import returnIcon from "../icons.js";
import showTaskDetails from "./task-details/task-details.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderBoardTemplate();
});

let currentTaskId;

window.filterTasks = function () {
  const searchInput = document.querySelector(".search input");
  const allTasks = document.querySelectorAll(".task");
  allTasks.forEach((task) => {
    const taskTitle = task.querySelector(".heading span").textContent;
    const taskDescription = task.querySelector(".heading p").textContent;
    if (taskTitle.toLowerCase().includes(searchInput.value.toLowerCase()) || taskDescription.toLowerCase().includes(searchInput.value.toLowerCase())) {
      task.classList.remove("d-none");
    } else {
      task.classList.add("d-none");
    }
  });
};

window.showTaskDetails = showTaskDetails;
window.closeTaskDetails = () => {
  const subTasks = document.querySelectorAll(".subtask");
  const taskId = document.querySelector(".task-details").getAttribute("data-task-id");
  const slot = document.querySelector(".task-details").getAttribute("data-task-slot");

  subTasks.forEach(async (subTask) => {
    const subTaskId = subTask.querySelector("input").id;
    const isChecked = subTask.querySelector("input").checked;
    await updateSubTaskStatus(slot, taskId, subTaskId, isChecked);
  });

  renderBoardTemplate();
};

window.allowDrop = function (event) {
  event.preventDefault();
};

window.moveTo = function (newStatus) {
  const taskElement = document.querySelector(`[data-task-id="${currentTaskId}"]`);
  document.getElementById(newStatus).appendChild(taskElement);
  removeAllHighlights();
  moveTaskToSlot(newStatus, currentTaskId);
};

window.startDragging = function (taskId) {
  currentTaskId = taskId;
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  taskElement.classList.add("rotate-task");
};

window.addAllHighlights = function () {
  const allSlots = document.querySelectorAll(".slot-content");
  allSlots.forEach((slot) => slot.classList.add("drag-area-highlight"));
};

window.removeAllHighlights = function () {
  const allSlots = document.querySelectorAll(".slot-content");
  allSlots.forEach((slot) => slot.classList.remove("drag-area-highlight"));
};

window.endDragging = function () {
  const taskElement = document.querySelector(`[data-task-id="${currentTaskId}"]`);
  taskElement.classList.remove("rotate-task");

  removeAllHighlights();
};

window.updatePlaceholder = function () {
  const allSlots = document.querySelectorAll(".slot-content");
  allSlots.forEach((slot) => {
    if (slot.children.length > 1) {
      slot.querySelector(".placeholder").classList.add("d-none");
    } else {
      slot.querySelector(".placeholder").classList.remove("d-none");
    }
  });
};

async function renderBoardTemplate() {
  const contactSectionRef = document.querySelector(".content");

  contactSectionRef.innerHTML = /*html*/ `
        <div class="board-container">
            <div class="board-heading">
            <div>
                <h2>Board</h2>
                <button class="covered-btn">${returnIcon("plus")}</button>
                </div>
                <div>
                  <div class="search"><input type="text" placeholder="Find Task" oninput="filterTasks()"><span>${returnIcon("search")}</span></div>
                  <button onclick="getAddTaskTemplate()">Add task${returnIcon("plus")}</button>
                </div> 
            </div>
            <div class="board">
              <div class="slots">
                <div class="slots-header">
                  <h2>To do</h2>
                  <button class="btn">${returnIcon("plus")}</button>
                </div>
                <div class="slot-content" id="todo-tasks" ondrop="moveTo('todo-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()"><div class="placeholder d-none"><p>No tasks To do</p></div></div>
              </div>

              <div class="slots">
                <div class="slots-header">
                  <h2>In Progress</h2>
                  <button class="btn">${returnIcon("plus")}</button>
                </div>
                <div class="slot-content" id="inProgress-tasks" ondrop="moveTo('inProgress-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()"><div class="placeholder d-none"><p>No tasks To do</p></div></div>
              </div>

              <div class="slots">
                <div class="slots-header">
                  <h2>Await feedback</h2>
                  <button class="btn">${returnIcon("plus")}</button>
                </div>
                <div class="slot-content" id="awaitFeedback-tasks" ondrop="moveTo('awaitFeedback-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()">
                  <div class="placeholder d-none"><p>No tasks To do</p></div>
                </div>
              </div>

              <div class="slots">
                <div class="slots-header"><h2>Done</h2></div>
                <div class="slot-content" id="done-tasks" ondrop="moveTo('done-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()"><div class="placeholder d-none"><p>No tasks To do</p></div></div>
              </div>
            </div>
        </div>
    `;

  renderTasks();
}

async function renderTasks() {
  const slots = {
    todo: document.getElementById("todo-tasks"),
    inProgress: document.getElementById("inProgress-tasks"),
    awaitFeedback: document.getElementById("awaitFeedback-tasks"),
    done: document.getElementById("done-tasks"),
  };
  const boardData = await returnBoard();
  for (let status in boardData) {
    for (let task of boardData[status]) {
      const taskTemplate = await returnTaskTemplate(task, status);
      slots[status].innerHTML += taskTemplate;
    }
  }
  document.querySelectorAll(".task").forEach((taskElement) => {
    taskElement.ondragstart = () => startDragging(taskElement.getAttribute("data-task-id"));
    taskElement.ondragend = endDragging;
  });

  document.querySelectorAll(".slot-content").forEach((slot) => {
    if (slot.children.length <= 1) {
      slot.querySelector(".placeholder").classList.remove("d-none");
    }
  });
}

import { returnBoard } from "../firebase.js";
import { returnTaskTemplate } from "./task-card/task-card.js";
import returnIcon from "../icons.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderBoardTemplate();
});

let currentTaskId;

window.allowDrop = function (event) {
  event.preventDefault();
};

window.moveTo = function (newStatus) {
  const taskElement = document.querySelector(`[data-task-id="${currentTaskId}"]`);
  document.getElementById(newStatus).appendChild(taskElement);
  removeAllHighlights();
};

window.startDragging = function (taskId) {
  currentTaskId = taskId;
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  taskElement.classList.add("rotate-task");
};

window.highlight = function (taskId) {
  document.getElementById(taskId).classList.add("drag-area-highlight");
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

window.updatePlaceholder = function (slot) {
  const placeholder = slot.querySelector(".placeholder");
  if (slot.children.length > 1) {
    placeholder.classList.add("d-none");
  } else {
    placeholder.classList.remove("d-none");
  }
};

async function renderBoardTemplate() {
  const contactSectionRef = document.querySelector(".content");

  contactSectionRef.innerHTML = /*html*/ `
        <div class="board-container">
            <div class="board-heading">
                <h2>Board</h2>
                <div>
                  <div class="search"><input type="text" placeholder="Find Task"><button>${returnIcon("search")}</button></div>
                  <button>Add task${returnIcon("plus")}</button>
                </div> 
            </div>
            <div class="board">
              <div class="slots">
                <div class="slots-header">
                  <h2>To do</h2>
                  <button class="btn">${returnIcon("plus")}</button>
                </div>
                <div class="slot-content" id="todo-tasks"  ondrop="moveTo('todo-tasks')"  ondragover="allowDrop(event); highlight('todo-tasks')"><div class="placeholder"><p>No tasks To do</p></div></div>
              </div>

              <div class="slots">
                <div class="slots-header">
                  <h2>In Progress</h2>
                  <button class="btn">${returnIcon("plus")}</button>
                </div>
                <div class="slot-content" id="inProgress-tasks" ondrop="moveTo('inProgress-tasks')"  ondragover="allowDrop(event); highlight('inProgress-tasks')" ><div class="placeholder"><p>No tasks To do</p></div></div>
              </div>

              <div class="slots">
                <div class="slots-header">
                  <h2>Await feedback</h2>
                  <button class="btn">${returnIcon("plus")}</button>
                </div>
                <div class="slot-content" id="awaitFeedback-tasks" ondrop="moveTo('awaitFeedback-tasks')"  ondragover="allowDrop(event); highlight('awaitFeedback-tasks')">
                  <div class="placeholder"><p>No tasks To do</p></div>
                </div>
              </div>

              <div class="slots">
                <div class="slots-header"><h2>Done</h2></div>
                <div class="slot-content" id="done-tasks" ondrop="moveTo('done-tasks')" ondragover="allowDrop(event); highlight('done-tasks')"><div class="placeholder"><p>No tasks To do</p></div></div>
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
      const taskTemplate = await returnTaskTemplate(task);
      slots[status].innerHTML += taskTemplate;
    }
  }
  document.querySelectorAll(".task").forEach((taskElement) => {
    taskElement.ondragstart = () => startDragging(taskElement.getAttribute("data-task-id"));
    taskElement.ondragend = endDragging;
  });
}

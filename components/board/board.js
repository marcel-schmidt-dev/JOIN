import { returnBoard, moveTaskToSlot, updateSubTaskStatus, checkAuth } from '../firebase.js';
import { returnTaskTemplate } from './task-card/task-card.js';
import returnIcon from '../icons.js';
import showTaskDetails from './task-details/task-details.js';
import openTaskMenu from './task-details/task-details.js';
import { renderModal, renderTaskForm } from './task-form/task-form.js';

window.openTaskMenu = openTaskMenu;
window.preventDrag = preventDrag;

// Initialize the board once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', async () => {
  initializeBoard();
});

/**
 * Initializes the task board, renders templates, and sets up event listeners.
 * @async
 */
async function initializeBoard() {
  checkAuth();
  await renderBoardTemplate();
}

let currentTaskId;

/**
 * Filters tasks based on the user's input in the search bar.
 */
window.filterTasks = function () {
  const searchInput = document.querySelector('.search input');
  const allTasks = document.querySelectorAll('.task');
  allTasks.forEach((task) => {
    const taskTitle = task.querySelector('.heading span').textContent;
    const taskDescription = task.querySelector('.heading p').textContent;
    if (taskTitle.toLowerCase().includes(searchInput.value.toLowerCase()) || taskDescription.toLowerCase().includes(searchInput.value.toLowerCase())) {
      task.classList.remove('d-none');
    } else {
      task.classList.add('d-none');
    }
  });
};

window.showTaskDetails = showTaskDetails;

/**
 * Closes the task details modal and updates subtask statuses.
 * @async
 */
window.closeTaskDetails = async () => {
  const subTasks = document.querySelectorAll('.subtask');
  const taskId = document.querySelector('.task-details').getAttribute('data-task-id');
  const slot = document.querySelector('.task-details').getAttribute('data-task-slot');

  subTasks.forEach(async (subTask) => {
    const subTaskId = subTask.querySelector('input').id;
    const isChecked = subTask.querySelector('input').checked;
    const title = subTask.querySelector('span').textContent;
    await updateSubTaskStatus(slot, taskId, subTaskId, isChecked, title);
  });

  initializeBoard();
};

/**
 * Allows drag-and-drop functionality by preventing the default dragover behavior.
 * @param {DragEvent} event - The dragover event.
 */
window.allowDrop = function (event) {
  event.preventDefault();
};

/**
 * Moves a task to a new status slot.
 * @param {string} newStatus - The ID of the new status slot.
 */
window.moveTo = function (newStatus) {
  const taskElement = document.querySelector(`[data-task-id="${currentTaskId}"]`);
  document.getElementById(newStatus).appendChild(taskElement);
  removeAllHighlights();
  moveTaskToSlot(newStatus, currentTaskId);
};

/**
 * Starts dragging a task.
 * @param {string} taskId - The ID of the task being dragged.
 */
window.startDragging = function (taskId) {
  currentTaskId = taskId;
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  taskElement.classList.add('rotate-task');
};

/**
 * Highlights all available slots during drag-and-drop.
 */
window.addAllHighlights = function () {
  const allSlots = document.querySelectorAll('.slot-content');
  allSlots.forEach((slot) => slot.classList.add('drag-area-highlight'));
};

/**
 * Removes highlights from all slots after drag-and-drop.
 */
window.removeAllHighlights = function () {
  const allSlots = document.querySelectorAll('.slot-content');
  allSlots.forEach((slot) => slot.classList.remove('drag-area-highlight'));
};

/**
 * Ends the dragging of a task and removes its drag styles.
 */
window.endDragging = function () {
  const taskElement = document.querySelector(`[data-task-id="${currentTaskId}"]`);
  taskElement.classList.remove('rotate-task');

  removeAllHighlights();
};

/**
 * Updates the placeholder visibility in slots based on their content.
 */
window.updatePlaceholder = function () {
  const allSlots = document.querySelectorAll('.slot-content');
  allSlots.forEach((slot) => {
    if (slot.children.length > 1) {
      slot.querySelector('.placeholder').classList.add('d-none');
    } else {
      slot.querySelector('.placeholder').classList.remove('d-none');
    }
  });
};

/**
 * Renders the board template, including slots for tasks, buttons, and search functionality.
 * @async
 */
export async function renderBoardTemplate() {
  let contentRef;
  while ((contentRef = document.querySelector('.content')) === null) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  contentRef.innerHTML = returnBoardTemplate();

  renderTasks();
  renderModal();

  const buttons = document.querySelectorAll('.slots-header .btn');
  const slots = ['todo', 'inProgress', 'awaitFeedback', 'done'];

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => renderTaskForm(slots[index], null));
  });
  const taskButton = document.getElementById('handleTask');
  const coveredButton = document.querySelector('.covered-btn');
  coveredButton.addEventListener('click', () => renderTaskForm('todo', null));
  taskButton.addEventListener('click', () => renderTaskForm('todo', null));
}

/**
 * Prevents the default drag behavior for an event.
 * @param {DragEvent} event - The drag event.
 */
function preventDrag(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Renders tasks inside their respective slots on the board.
 * @async
 */
export async function renderTasks() {
  const slots = {
    todo: document.getElementById('todo-tasks'),
    inProgress: document.getElementById('inProgress-tasks'),
    awaitFeedback: document.getElementById('awaitFeedback-tasks'),
    done: document.getElementById('done-tasks'),
  };

  for (let slot in slots) {
    slots[slot].innerHTML = `<div class="placeholder ph d-none" draggable="false" ondragstart="preventDrag(event)"><p>No tasks To do</p></div>`;
  }

  const boardData = await returnBoard();
  for (let status in boardData) {
    for (let task of boardData[status]) {
      const taskTemplate = await returnTaskTemplate(task, status);
      slots[status].innerHTML += taskTemplate;
    }
  }

  document.querySelectorAll('.task').forEach((taskElement) => {
    taskElement.ondragstart = () => startDragging(taskElement.getAttribute('data-task-id'));
    taskElement.ondragend = endDragging;
  });

  document.querySelectorAll('.slot-content').forEach((slot) => {
    if (slot.children.length < 1) {
      slot.querySelector('.placeholder').classList.remove('d-none');
    }
  });
  updatePlaceholder();
}

/**
 * Checks if the current device is mobile based on the viewport width.
 * @returns {boolean} `true` if the device is mobile, `false` otherwise.
 */
function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Enables drag-and-drop functionality for desktop devices.
 */
if (!isMobile()) {
  window.allowDrop = function (event) {
    event.preventDefault();
  };

  /**
   * Starts dragging a task, storing its ID.
   * @param {DragEvent} event - The drag event.
   * @param {string} taskId - The ID of the task being dragged.
   */
  window.dragTask = function (event, taskId) {
    currentTaskId = taskId;
    event.dataTransfer.setData('text', taskId);
  };

  /**
   * Handles dropping a task into a new slot and updating its status.
   * @param {DragEvent} event - The drop event.
   * @param {string} newStatus - The new status of the task.
   */
  window.dropTask = function (event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text');
    moveTaskToSlot(taskId, newStatus);
    renderBoardTemplate();
  };
} else {
  window.allowDrop = function () {};
  window.dragTask = function () {};
  window.dropTask = function () {};
}

/**
 * Toggles drag-and-drop functionality based on the viewport size.
 */
function toggleDragAndDrop() {
  if (window.innerWidth <= 768) {
    window.allowDrop = () => {};
    window.dragTask = () => {};
    window.dropTask = () => {};
  } else {
    window.allowDrop = (e) => e.preventDefault();
    window.dragTask = (e, taskId) => {
      currentTaskId = taskId;
      e.dataTransfer.setData('text', taskId);
    };
    window.dropTask = (e, newStatus) => {
      e.preventDefault();
      moveTaskToSlot(e.dataTransfer.getData('text'), newStatus);
      renderBoardTemplate();
    };
  }
}

// Add a resize event listener to toggle drag-and-drop functionality dynamically.
window.addEventListener('resize', toggleDragAndDrop);
toggleDragAndDrop();

/**
 *  Returns the HTML template for the task board.
 * @returns {string} The HTML template for the task board.
 */
function returnBoardTemplate() {
  return /*html*/ `
  <div class="board-container">
      <div class="board-heading">
      <div class="board-header">
          <h2>Board</h2>
          <button class="covered-btn">${returnIcon('plus')}</button>
          </div>
          <div>
            <div class="search"><input type="text" placeholder="Find Task" oninput="filterTasks()"><span>${returnIcon('search')}</span></div>
            <button id="handleTask">Add task${returnIcon('plus')}</button>
          </div> 
      </div>
      <div class="board">
        <div class="slots">
          <div class="slots-header">
            <h2>To do</h2>
            <button class="btn">${returnIcon('plus')}</button>
          </div>
          <div class="slot-content" id="todo-tasks" ondrop="moveTo('todo-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()"><div class="placeholder ph d-none" draggable="false" ondragstart="preventDrag(event)"><p>No tasks To do</p></div></div>
        </div>

        <div class="slots">
          <div class="slots-header">
            <h2>In Progress</h2>
            <button class="btn">${returnIcon('plus')}</button>
          </div>
          <div class="slot-content" id="inProgress-tasks" ondrop="moveTo('inProgress-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()"><div class="placeholder ph d-none" draggable="false" ondragstart="preventDrag(event)"><p>No tasks To do</p></div></div>
        </div>

        <div class="slots">
          <div class="slots-header">
            <h2>Await feedback</h2>
            <button class="btn">${returnIcon('plus')}</button>
          </div>
          <div class="slot-content" id="awaitFeedback-tasks" ondrop="moveTo('awaitFeedback-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()">
            <div class="placeholder ph d-none" draggable="false" ondragstart="preventDrag(event)"><p>No tasks To do</p></div>
          </div>
        </div>

        <div class="slots">
          <div class="slots-header"><h2>Done</h2></div>
          <div class="slot-content" id="done-tasks" ondrop="moveTo('done-tasks'); updatePlaceholder();" ondragover="allowDrop(event);" ondragstart="addAllHighlights()"><div class="placeholder ph d-none" draggable="false" ondragstart="preventDrag(event)"><p>No tasks To do</p></div></div>
        </div>
      </div>
  </div>
`;
}

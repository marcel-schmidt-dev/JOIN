/**
 * Imports necessary functions and icons for task details.
 */
import { returnTaskById, getContact, returnSubTasks, deleteTask } from "../../firebase.js";
import returnIcon from "../../icons.js";
import { getInitialsFromName } from "../../utility-functions.js";
import { renderBoardTemplate, renderTasks } from "../board.js";
import { moveTaskToSlot } from "../../firebase.js";

// Attach the moveTaskToSlot function to the global window object.
window.moveTaskToSlot = moveTaskToSlot;

/**
 * Displays detailed information about a task.
 * @async
 * @param {string} taskId - The ID of the task to display.
 * @param {string} slot - The current slot the task belongs to.
 */
export default async function showTaskDetails(taskId, slot) {
  const task = await returnTaskById(taskId);
  const contentRef = document.querySelector(".content");
  const assignees = task.assignee
    ? await Promise.all(task.assignee.map((id) => getContact(id)))
    : [];
  const subTasks = await returnSubTasks(taskId, slot);

  contentRef.innerHTML += /*html*/ `
        <div class="task-details-container">
            <div class="task-details" data-task-id=${taskId} data-task-slot=${slot}>
                <div class="top">
                    <div class="type" style="background-color: ${
                      task.type === "Technical Task" ? "#1FD7C1" : "#0038FF"
                    }">${task.type}</div>
                    <div class="close" onclick="closeTaskDetails()">✘</div>
                </div>
                <h2>${task.title}</h2>
                <p class="description">${task.description}</p>
                <table>
                    <tr>
                        <td>Due date:</td>
                        <td>${task.dueDate}</td>
                    </tr>
                    <tr>
                        <td>Priority:</td>
                        <td class="${task.priority}"><span>${task.priority}</span>${returnIcon(
    task.priority
  )}</td>
                    </tr>
                </table>
                
                <div class="assignee-list">
                 <p>Assigned To:</p>
                 <div class="assignee-container">
                     ${assignees
                       .slice(0, 3)
                       .map((assignee) => {
                         return `<div class="assignee">
                        <div class="bubble" style="background-color: #${
                          assignee.userColor
                        }">${getInitialsFromName(assignee.fullName)}</div>
                        <span>${assignee.fullName}</span>
                        </div>`;
                       })
                       .join("")}
                        ${
                          assignees.length > 3
                            ? ` 
                         <div class="assignee extra-assignees" title="${assignees
                           .slice(3)
                           .map((a) => a.fullName)
                           .join(", ")}">
                         <div class="bubble" style="background-color: #d1d1d1;">+${
                           assignees.length - 3
                         }</div>
                         <span>+ ${assignees.length - 3} more</span>
                         </div>`
                            : ""
                        }
                </div>
       </div>

                <div class="subtask-list">
                    <p>Subtasks:</p>
                    ${subTasks
                      .map((subtask) => {
                        return `<div class="subtask"><input type="checkbox" ${
                          subtask.checked ? "checked" : ""
                        } name="${subtask.id}" id="${subtask.id}"><span>${
                          subtask.title
                        }</span></div>`;
                      })
                      .join("")}
                </div>
                <div class="move-buttons">
                    <button class="move-btn" data-slot="todo-tasks">To-Do</button>
                    <button class="move-btn" data-slot="inProgress-tasks">In Progress</button>
                    <button class="move-btn" data-slot="awaitFeedback-tasks">Awaiting Feedback</button>
                    <button class="move-btn" data-slot="done-tasks">Done</button>
                </div>
                <div class="buttons">
                    <button class="delete-btn">${returnIcon("trash-outline")}Delete</button>
                    <hr>
                    <button>${returnIcon("pen")}Edit</button>
                </div>
            </div>
        </div>
    `;

  const moveButtons = contentRef.querySelectorAll(".move-btn");
  moveButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const slot = event.target.dataset.slot;
      try {
        await moveTaskToSlot(slot, taskId);
        closeTaskDetails();
        await renderBoardTemplate();
      } catch (error) {
        console.error("Error moving task:", error);
      }
    });
  });

  const deleteButton = contentRef.querySelector(".delete-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      deleteTask(slot, taskId);
      document.querySelector(".task-details-container").remove();
      await renderBoardTemplate();
    });
  }
}

/**
 * Closes the task details view.
 */
export function closeTaskDetails() {
  document.querySelector(".task-details-container").remove();
}

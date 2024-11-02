import returnIcon from "../../icons.js";
import { getContact } from "../../firebase.js";
import { getInitialsFromName } from "../../utility-functions.js";

export async function returnTaskTemplate(task, slot) {
  let assigneeList = await returnContacts(task.assignee);

  return /*html*/ `
        <div class="task" draggable="true" 
         ondragstart="startDragging('${task.id}')" 
         data-task-id="${task.id}" onclick="showTaskDetails('${task.id}', '${slot}')">
            <div class="type ${task.type === "Technical Task" ? "technical" : "story"}" >${task.type}</div>
            <div class="heading">
                <span>${task.title}</span>
                <p>${task.description}</p>
            </div>
            ${
              task.subTasks
                ? `<div class="sub-tasks">
                <progress value=${returnCheckedSubtasks(task.subTasks)} max=${task.subTasks.length}></progress>
                <span>${returnCheckedSubtasks(task.subTasks)}/${task.subTasks.length} Subtasks</span>
            </div>`
                : ""
            }
            <div class="assignee-priority" style="justify-content: ${task.assignee ? "space-between" : "flex-end"}">
              ${
                assigneeList && assigneeList.length > 0
                  ? `<div class="assignee">
                ${assigneeList
                  .slice(0, 3)
                  .map((assignee) => `<div class="assignee-icon" style="background-color: #${assignee.userColor}">${getInitialsFromName(assignee.fullName)}</div>`)
                  .join("")}
                ${assigneeList.length > 3 ? `<div class="assignee-icon extra-assignees">+${assigneeList.length - 3}</div>` : ""} 
              </div>`
                  : ""
              }
              <div class="priority ${task.priority}">
                 ${returnIcon(task.priority)}
              </div>
            </div>
        </div>
    `;
}

async function returnContacts(ids) {
  if (!ids) return null;
  let contactPromises = ids.map((id) => getContact(id));
  let contacts = await Promise.all(contactPromises);
  return contacts;
}

function returnCheckedSubtasks(subtasks) {
  let checkedSubtasks = subtasks.filter((subtask) => subtask.checked);
  return checkedSubtasks.length;
}

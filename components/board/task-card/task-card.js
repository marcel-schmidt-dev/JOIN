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
            <div class="sub-tasks">
                <progress value=${returnCheckedSubtasks(task.subTasks)} max=${task.subTasks.length}></progress>
                <span>${returnCheckedSubtasks(task.subTasks)}/${task.subTasks.length} Subtasks</span>
            </div>
            <div class="assignee-priority">
                <div class="assignee">
                    ${assigneeList
            .map((assignee) => `<div class="assignee-icon" style="background-color: #${assignee.userColor}">${getInitialsFromName(assignee.fullName)}</div>`)
            .join("")}
                </div>
                <div class="priority ${task.priority}">
                    ${returnIcon(task.priority)}
                </div>
            </div>
        </div>
    `;
}

async function returnContacts(ids) {
    let contactPromises = ids.map((id) => getContact(id));
    let contacts = await Promise.all(contactPromises);
    return contacts;
}

function returnCheckedSubtasks(subtasks) {
    let checkedSubtasks = subtasks.filter((subtask) => subtask.checked);
    return checkedSubtasks.length;
}

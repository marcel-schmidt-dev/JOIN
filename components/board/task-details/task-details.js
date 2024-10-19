import { returnTaskById, getContact, returnSubTasks } from "../../firebase.js";
import returnIcon from "../../icons.js";
import { getInitialsFromName } from "../../utility-functions.js";

export default async function showTaskDetails(taskId, slot) {
    const task = await returnTaskById(taskId);
    const contentRef = document.querySelector(".content");
    const assignees = await Promise.all(task.assignee.map((id) => getContact(id)));
    const subTasks = await returnSubTasks(taskId, slot);

    contentRef.innerHTML += /*html*/ `
        <div class="task-details-container">
            <div class="task-details">
                <div class="top">
                    <div class="type" style="background-color: ${task.type === 'Technical Task' ? '#1FD7C1' : '#0038FF'}">${task.type}</div>
                    <div class="close" onclick="closeTaskDetails()">X</div>
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
                        <td class="${task.priority}"><span>${task.priority}</span>${returnIcon(task.priority)}</td>
                    </tr>
                </table>
                
                <div class="assignee-list">
                <p>Assigned To:</p>
                    ${assignees.map((assignee) => { return `<div class="assignee"><div class="bubble" style="background-color: #${assignee.userColor}">${getInitialsFromName(`${assignee.fullName}`)}</div><span>${assignee.fullName}</span></div>` }).join("")}
                </div>

                <div class="subtask-list">
                    <p>Subtasks:</p>
                    ${subTasks.map((subtask) => { return `<div class="subtask"><input type="checkbox" ${subtask.checked ? 'checked' : ''} name="${subtask.id}" id="${subtask.id}"><span>${subtask.title}</span></div>` }).join("")}
                </div>
                <div class="buttons">
                    <button>${returnIcon('trash-outline')}Delete</button>
                    <hr>
                    <button>${returnIcon('pen')}Edit</button>
                </div>
            </div>
        </div>
    `;
}
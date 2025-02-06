import returnIcon from './../../icons.js';
import { returnAssigneeInput } from './task-form.js';

/**
 * Generates the HTML template for the task form.
 * @param {Object} task - The task object containing the data to populate the form (optional).
 * @param {string} task.id - The ID of the task (optional).
 * @param {string} task.title - The title of the task (optional).
 * @param {string} task.description - The description of the task (optional).
 * @param {string} task.dueDate - The due date of the task (optional).
 * @param {string} task.priority - The priority of the task (optional).
 * @param {string} task.type - The type/category of the task (optional).
 * @param {string} slot - The slot where the task will be added or edited.
 * @returns {Promise<string>} The HTML string for the task form template.
 */
export async function returnTaskForm(task, slot) {
  return /*html*/ `
      <div class="task-form">
        <h1>${task ? 'Edit Task' : 'Add Task'}</h1>
        <div class="task-form-container">
          <form id="task-form" onsubmit="handleSubmitTask(event, '${slot}', '${task ? task.id : ''}')">
            <div>
              <label for="title">Title<span class="red-star">*</span></label>
              <input type="text" id="title" name="title" placeholder="Enter a title" value="${task ? task.title : ''}">
              <div class="request-alert">
                <p id="request-title" >This field is required</p>
              </div>
              <label for="description">Description</label>
              <textarea id="description" name="description" placeholder="Enter a Description" rows="3">${task ? task.description : ''}</textarea>
              ${await returnAssigneeInput()}
              <div class="assignees"></div>
            </div>
            <hr />
            <div>
              <label for="due-date">Due date<span class="red-star">*</span></label>
              <input type="date" id="due-date" name="due-date" onClick="showDatepicker()" value="${task ? task.dueDate : ''}">
              <div class="request-alert">
                <p id="request-date" >This field is required</p>
              </div>
              <label for="priority">Prio</label>
              <div class="priorities">
                <button type="button" class="priority ${task ? (task.priority === 'urgent' ? 'selected' : '') : ''}" onClick="handlePriorityClick(this)" value="urgent">Urgent ${returnIcon('urgent')}</button>
                <button type="button" class="priority ${task ? (task.priority === 'medium' ? 'selected' : '') : 'selected'}" onClick="handlePriorityClick(this)" value="medium">Medium ${returnIcon('medium')}</button>
                <button type="button" class="priority ${task ? (task.priority === 'low' ? 'selected' : '') : ''}" onClick="handlePriorityClick(this)" value="low">Low ${returnIcon('low')}</button>
              </div>
              <label for="category">Category<span class="red-star">*</span></label>
              <select name="category" id="category" ${task ? 'disabled' : ''}>
                <option value="" disabled ${!task && 'selected'}>Select task category</option>
                <option value="User Story" ${task && task.type === 'User Story' ? 'selected' : ''}>User Story</option>
                <option value="Technical Task" ${task && task.type === 'Technical Task' ? 'selected' : ''}>Technical Task</option>
              </select>
              <div class="request-alert">
                  <p id="request-category" >This field is required</p>
              </div>
              <label for="Subtasks">Subtasks</label>
              <div class="input-container">
                <input type="text" id="subtasks-input" name="" placeholder="Add new subtask"/> 
                <div class="icon" onclick="addSubtask()">
                  ${returnIcon('plus')}
                </div>
              </div>
              <div class="subtasks"></div> 
            </div>
            <div class="footer-buttons">
              <p><span class="red-star">*</span>This field is required</p>
              <div class="buttons">
                <button type="button" onclick="clearForm()" id="clear-form" class="clear-button">Clear ${returnIcon('x')}</button>
                <button type="submit"  id="submit-task" class="submit-button">${!task ? 'Create Task' : 'Edit Task'} ${returnIcon('check')} </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
}

/**
 * Generates the HTML template for a subtask.
 * @param {Object} subtask - The subtask object.
 * @param {string} subtask.title - The title of the subtask.
 * @param {number} index - The index of the subtask.
 * @returns {string} The HTML string for the subtask template.
 */
export function returnSubTasksTemplate(subtask, index) {
  return /*html*/ `
      <div class="subtask" data-index="${index}">
        <input type="text" class="subtask-container" value="${subtask.title}"> 
        <div class="buttons">
          <button type="button" onClick="editSubtask(event)">${returnIcon('pen-outline')}</button>
          <button type="button" onmousedown="deleteSubTask(event)">${returnIcon('trash-outline')}</button>
          <button type="button" onmousedown="saveSubtask(event)">${returnIcon('check')}</button>
        </div>
      </div>
    `;
}

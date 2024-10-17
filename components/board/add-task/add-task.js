import returnIcon from "../../icons.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderTaskTemplate();
  await getAddTaskTemplate();
});

async function renderTaskTemplate() {
  const taskSectionRef = document.querySelector(".content");
  taskSectionRef.innerHTML = /*html*/ `
        <div class="task-content"></div>
    `;
}

async function getAddTaskTemplate() {
  const addTaskRef = document.querySelector(".task-content");
  addTaskRef.innerHTML += /*html*/ `
        <div class="main-content">
            <h1>Add Task</h1>
            <div class="input-container">
                <div class="input-left">
                    <div class="title-input">
                        <h2>Title
                            <span>*</span>
                        </h2>
                        <input type="text" name="title" class="title-container" placeholder="Enter a title"/>
                    </div>
                    <div class="description-input">
                        <h2>Description</h2>
                        <textarea type="text" name="description" class="description-container" placeholder="Enter a description" rows="5"></textarea>
                    </div>
                    <div class="assigned-input">
                        <h2>Assigned to</h2>
                        <div class="assigned">
                         <input type="text" name="assigned" class="assigned-container" id="selected-contact" placeholder="Select contacts to assign" readonly />
                         ${returnIcon("arrow-dropdown")}
                        </div>
                    </div>
                    
                </div>
                <div class="separator"></div>
                <div class="input-right">
                    <div class="date-input">
                        <h2>Due date
                            <span>*</span>
                        </h2>
                        <div class="date">
                         <input type="text" name="date" class="date-container" placeholder="dd/mm/yyyy"/>
                         ${returnIcon("calendar")}
                        </div>
                    </div>
                    <div class="priority">
                        <h2>Prio</h2>
                        <div class="priority-buttons">
                            <button class="button-urgent">Urgent ${returnIcon("urgent")}</button>
                            <button class="button-medium">Medium ${returnIcon("medium")}</button>
                            <button class="button-low">Low ${returnIcon("low")}</button>
                        </div>
                    </div>
                    <div class="category">
                        <h2>Category
                            <span>*</span>
                        </h2>
                        <div class="category-input">
                         <input type="text" name="category" class="category-container" id="category" placeholder="Select task category" readonly />
                         ${returnIcon("arrow-dropdown")}
                        </div>
                    </div>
                    <div class="subtasks">
                        <h2>Subtasks</h2>
                        <div class="subtasks-input">
                         <input type="text" name="subtasks" class="subtasks-container" id="subtasks" placeholder="Add new subtask"/>
                         ${returnIcon("plus")}
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-bottom">
             <div class="span-content">
                    <span class="span-container">*</span>
                    <span>This field is required</span>
             </div>
             <div class="add-task-button-container">
                    <button class="clear">Clear ${returnIcon("x")}</button>
                    <button class="create">Create task ${returnIcon("check")}</button>
             </div>
            </div>
        </div>
    `;
}

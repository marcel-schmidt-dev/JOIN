import returnIcon from "../../icons";

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
        <div class="content">
            <h1>Add Task</h1>
            <div class="input-container">
                <div class="input-left">
                    <div class="title-input">
                        <h2>Title
                            <span>*</span>
                        </h2>
                        <input type="text" name="title" placeholder="Enter a title"/>
                    </div>
                    <div class="description-input">
                        <h2>Description</h2>
                        <textarea type="text" name="description" placeholder="Enter a description" rows="5" />
                    </div>
                    <div class="assigned-input">
                        <h2>Assigned to</h2>
                        <input type="text" name="assigned" id="selected-contact" placeholder="Select contacts to assign" readonly />
                        ${returnIcon("arrow-dropdown")}
                    </div>
                    <span>*</span>
                    <span>This field is required</span>
                </div>
                <div class="input-right">
                    <div class="date-input">
                        <h2>Due date
                            <span>*</span>
                        </h2>
                        <input type="text" name="date" placeholder="dd/mm/yyyy"/>
                        ${returnIcon("calendar")}
                    </div>
                    <div class="priority">
                        <h2>Prio</h2>
                            <button>Urgent ${returnIcon("urgent")}</button>
                            <button>Medium ${returnIcon("medium")}</button>
                            <button>Low ${returnIcon("low")}</button>
                    </div>
                    <div class="category">
                        <h2>Category
                            <span>*</span>
                        </h2>
                        <input type="text" name="category" id="category" placeholder="Select task category" readonly />
                        ${returnIcon("arrow-dropdown")}
                    </div>
                    <div class="subtasks">
                        <h2>Subtasks</h2>
                        <input type="text" name="subtasks" id="subtasks" placeholder="Add new subtask"/>
                        ${returnIcon("plus")}
                    </div>
                </div>
                <div class="add-task-button-container">
                    <button>Clear ${returnIcon("x")}</button>
                    <button>Create task ${returnIcon("check")}</button>
                </div>
            </div>
        </div>
    `;
}

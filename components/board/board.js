import { returnBoard } from "../firebase.js";
import { returnTaskTemplate } from "./task-card/task-card.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderBoardTemplate();
});

async function renderBoardTemplate() {
  const contactSectionRef = document.querySelector(".content");

  contactSectionRef.innerHTML = /*html*/ `
        <div class="board-container">
            <div class="heading">
                <h2>Board</h2>
                <div class="search"><input type="text"><button></button></div>
                <button>Add task</button>
            </div>
            <div class="board">
              <div class="slots">
                <div class="slots-header">
                  <h2>To do</h2>
                  <button class="btn">+</button>
                </div>
                <div class="slot-content" id="todo-tasks"></div>
              </div>

              <div class="slots">
                <div class="slots-header">
                  <h2>In Progress</h2>
                  <button class="btn">+</button>
                </div>
                <div class="slot-content" id="inProgress-tasks"></div>
              </div>

              <div class="slots">
                <div class="slots-header">
                  <h2>Await feedback</h2>
                  <button class="btn">+</button>
                </div>
                <div class="slot-content" id="awaitFeedback-tasks"></div>
              </div>

              <div class="slots">
                <div class="slots-header"><h2>Done</h2></div>
                <div class="slot-content" id="done-tasks"></div>
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
}

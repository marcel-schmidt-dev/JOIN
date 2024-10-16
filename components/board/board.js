import { returnBoard } from "../firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
  await renderBoard();
  await getBoardTemplate();
});

async function renderBoard() {
  const contactSectionRef = document.querySelector(".content");

  contactSectionRef.innerHTML = /*html*/ `
        <div class="board-container">
            <div class="heading">
                <h2>Board</h2>
                <div class="search"><input type="text"><button></button></div>
                <button>Add task</button>
            </div>
            <div class="board"></div>
        </div>
    `;
}

async function getBoardTemplate() {
  const contactSectionRef = document.querySelector(".board-container");
  contactSectionRef.innerHTML += /*html*/ `
          <section class="slot-section">
      <div class="slots">
        <div class="slots-header">
          <h2>To Do</h2>
          <button class="btn">+</button>
        </div>
        <div class="slot-content" id="todo-tasks"></div>
      </div>

      <div class="slots">
        <div class="slots-header">
          <div><h2>In Progress</h2></div>
          <button class="btn">+</button>
        </div>
        <div class="slot-content" id="inProgress-tasks"></div>
      </div>

      <div class="slots">
        <div class="slots-header">
          <div>
            <h2>Await feedback</h2>
          </div>
          <button class="btn">+</button>
        </div>
        <div class="slot-content" id="awaitFeedback-tasks"></div>
      </div>

      <div class="slots">
        <div class="slots-header"><h2>Done</h2></div>
        <div class="slot-content" id="done-tasks">
         
        </div>
      </div>
    </section>
    `;
  renderTasks();
}

async function renderTasks() {
  const slots = {
    todo: document.querySelector("#todo-tasks"),
    inProgress: document.querySelector("#inProgress-tasks"),
    awaitFeedback: document.querySelector("#awaitFeedback-tasks"),
    done: document.querySelector("#done-tasks"),
  };
  const boardData = await returnBoard();
  for (let status in boardData) {
    boardData[status].forEach((task) => {
      let taskElement = document.createElement("div");
      taskElement.textContent = task.title;
      slots[status].appendChild(taskElement);
    });
  }
}

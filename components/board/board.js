document.addEventListener("DOMContentLoaded", async () => {
  await renderBoard();
});
document.addEventListener("DOMContentLoaded", async () => {
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
  const contactSectionRef = document.querySelector(".content");
  contactSectionRef.innerHTML += /*html*/ `
          <section class="slot-section">
      <div class="slots">
        <div class="slots-header">
          <h2>To Do</h2>
          <button class="btn">+</button>
        </div>
        <div class="slot-content"></div>
      </div>

      <div class="slots">
        <div class="slots-header">
          <div><h2>In Progress</h2></div>
          <button class="btn">+</button>
        </div>
        <div class="slot-content" id="slot-content"></div>
      </div>

      <div class="slots">
        <div class="slots-header">
          <div>
            <h2>Await feedback</h2>
          </div>
          <button class="btn">+</button>
        </div>
        <div class="slot-content"></div>
      </div>

      <div class="slots">
        <div class="slots-header"><h2>Done</h2></div>
        <div class="slot-content">
          <p>test</p>
          <p>test3</p>
          <p>test5</p>
        </div>
      </div>
    </section>
    `;
}

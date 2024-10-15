document.addEventListener("DOMContentLoaded", async () => {
    await renderBoard();
});

async function renderBoard() {
    const contactSectionRef = document.querySelector(".content");

    contactSectionRef.innerHTML = /*html*/`
        <div class="board-container">
            <div class="heading">
                <h2>Board</h2>
                <div class="search"><input type="text"><button></button></div>
                <button>Add task</button>
            </div>
            <div class="board"></div>
        </div>
    `
}
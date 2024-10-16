import returnIcon from "../../icons";

document.addEventListener("DOMContentLoaded", async () => {
  await getAddTaskTemplate();
});

async function getAddTaskTemplate() {
  const addTaskRef = document.querySelector(".content");
  addTaskRef.innerHTML += /*html*/ `
        <div class="content">
            <h1>Add Task</h1>
            <div class="input-container">
                <div class="input-left">
                    <div class="title-input">
                        <h2>Title
                            <span>*</span>
                        </h2>
                        <input type="text" placeholder="Enter a title">
                    </div>
                    <div class="description-input">
                        <h2>Description</h2>
                        <textarea type="text" placeholder="Enter a description" rows="5">
                    </div>
                    <div class="assigned-input">
                        <h2>Assigned to</h2>
                        <input type="text" id="selected-contact" placeholder="Select contacts to assign" readonly >
                    </div>
                </div>
            </div>
        </div>
    `;
}

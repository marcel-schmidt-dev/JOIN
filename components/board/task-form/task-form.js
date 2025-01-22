import { checkAuth } from "./../../firebase.js";
import { returnPath } from "./../../utility-functions.js";

document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();

    if (returnPath() === '/add-task.html') {
        renderTaskForm();
    }
});

export async function renderTaskForm(className = ".content", contact = "") {
    let contentRef;
    while ((contentRef = document.querySelector(className)) === null) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (contentRef) {
        contentRef.innerHTML = /*html*/ `
            <form id="task-form">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" placeholder="Title" required>
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder=""></textarea>
            </form>
        `;
    }
};
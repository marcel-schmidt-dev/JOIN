import returnIcon from "../icons.js";
import { getAuthUser } from "../firebase.js";

export default async function returnSidebar() {
    const urlPath = window.location.pathname;
    const user = await getAuthUser();

    return /*html*/ `
        <div class="sidebar">
            ${returnIcon("logo-light")}
            ${user ? `
                <menu>
                    <a class="${urlPath === "/summary.html" ? "active" : ""}" href="./summary.html">${returnIcon("summary")} Summary</a>
                    <a class="${urlPath === "/add-task.html" ? "active" : ""}" href="./add-task.html">${returnIcon("add-task")} Add Task</a>
                    <a class="${urlPath === "/board.html" ? "active" : ""}" href="./board.html">${returnIcon("board")} Board</a>
                    <a class="${urlPath === "/contacts.html" ? "active" : ""}" href="./contacts.html">${returnIcon("contacts")} Contacts</a>
                </menu>` : ""}
            
            <footer>
                <a href="./privacy-policy.html" target="_blank" >Privacy Policy</a>
                <a href="./legal-notice.html" target="_blank" >Legal notice</a>
            </footer>
        </div>
    `;
}

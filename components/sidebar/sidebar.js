import returnIcon from "../icons.js"

export default function returnSidebar() {
    return /*html*/`
        <div class="sidebar">
            ${returnIcon('logo-light')}
            <menu>
                <a href="./summary.html">${returnIcon('summary')} Summary</a>
                <a href="./add-task.html">${returnIcon('add-task')} Add Task</a>
                <a href="./board.html">${returnIcon('board')} Board</a>
                <a href="./contacts.html">${returnIcon('contacts')} Contacts</a>
            </menu>
            <footer>
                <a href="./privacy-policy.html">Privacy Policy</a>
                <a href="./legal-notice.html">Legal notice</a>
            </footer>
        </div>
    `
}
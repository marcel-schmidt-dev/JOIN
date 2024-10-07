import returnIcon from "./icons.js"

export default function returnSidebar() {
    return /*html*/`
        <div class="sidebar">
            ${returnIcon('logo-light')}
            <menu>
                <a href="#">${returnIcon('summary')} Summary</a>
                <a href="#">${returnIcon('add-task')} Add Task</a>
                <a href="#">${returnIcon('board')} Board</a>
                <a href="#">${returnIcon('contacts')} Contacts</a>
            </menu>
            <footer>
                <a href="#">Privacy Policy</a>
                <a href="#">legal notice</a>
            </footer>
        </div>
    `
}
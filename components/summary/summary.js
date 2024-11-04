import returnIcon from "../icons.js";
import { returnBoard, getAuthUser } from "../firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    await renderSummaryTemplate();
});

function getRelevantDueDate(tasks) {
    const today = new Date();
    const parsedDueDates = tasks.map(task => new Date(task.dueDate));
    const overdueDates = parsedDueDates.filter(date => date < today);

    let selectedDate;
    if (overdueDates.length > 0) {
        overdueDates.sort((a, b) => a - b);
        selectedDate = overdueDates[0];
    } else {
        parsedDueDates.sort((a, b) => a - b);
        selectedDate = parsedDueDates[0];
    }
    return selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}


async function renderSummaryTemplate() {
    const board = await returnBoard();

    const user = await getAuthUser();

    let urgentTasks = [];
    let allTasks = [];
    Object.keys(board).forEach((key) => {
        board[key].forEach((task) => {
            allTasks.push(task);
            if (task.priority === "urgent") {
                urgentTasks.push(task);
            }
        });
    });

    let contentRef;

    while ((contentRef = document.querySelector(".content")) === null) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    contentRef.innerHTML = /*html*/ `
        
        <div class="summary-container">
        <div class="summary-heading">
            <h1>Join 360</h1>
            <div>
                <hr>
                <span>Key Metrics at a Glance</span>
            </div>
        </div>
        <div class="summary-row">
            <div class="summary-col">
                <div class="summary-grid">
                    <a href="./board.html" class="summary-card-2">
                        <div class="summary-card-icon">${returnIcon('pen')}</div>
                        <div class="summary-card-content"><span>${board['todo'] ? board['todo'].length : 0}</span><br>To-do</div>
                    </a>
                    <a href="./board.html" class="summary-card-2">
                        <div class="summary-card-icon">${returnIcon('check')}</div>
                        <div class="summary-card-content"><span>${board['done'] ? board['done'].length : 0}</span><br>Done</div>
                    </a>
                    <a href="./board.html" class="summary-card-1">
                        <div>
                            <div class="summary-card-icon">${returnIcon('urgent')}</div>
                            <div class="summary-card-content"><span>${urgentTasks.length}</span><br>Urgent</div>
                        </div>
                        <hr>
                        <div>
                            <div class="date">${getRelevantDueDate(allTasks)}</div>
                            <div class="deadline">Upcoming Deadline</div>
                        </div>
                    </a>
                    <a href="./board.html" class="summary-card-3">
                        <span>${allTasks.length}</span>Tasks in Board
                    </a>
                    <a href="./board.html" class="summary-card-3">
                        <span>${board['inProgress'] ? board['inProgress'].length : 0}</span>Tasks in Progress
                    </a>
                    <a href="./board.html" class="summary-card-3">
                        <span>${board['awaitFeedback'] ? board['awaitFeedback'].length : 0}</span>Awaiting Feedback
                    </a>
                </div>
            </div>
            <div class="summary-col">
                Good morning,
                <div>${user.displayName ? user.displayName : 'Guest'}</div>
            </div>
        </div>
            
        </div>
    `
}
import returnIcon from "../icons.js";

document.addEventListener("DOMContentLoaded", async () => {
    await renderSummaryTemplate();
});

async function renderSummaryTemplate() {
    let contentRef;

    while ((contentRef = document.querySelector(".content")) === null) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    contentRef.innerHTML = /*html*/ `
        <div class="summary-container">
            <div class="summary-col">
                <div class="summary-heading">
                    <h1>Join 360</h1>
                    <div>
                        <hr>
                        <span>Key Metrics at a Glance</span>
                    </div>
                </div>
                <div class="summary-grid">
                    <div class="summary-card-2">
                        <div class="summary-card-icon">${returnIcon('pen')}</div>
                        <div class="summary-card-content"><span>1</span><br>To-do</div>
                    </div>
                    <div class="summary-card-2">
                        <div class="summary-card-icon">${returnIcon('check')}</div>
                        <div class="summary-card-content"><span>1</span><br>Done</div>
                    </div>
                    <div class="summary-card-1">
                        <div>
                            <div class="summary-card-icon">${returnIcon('urgent')}</div>
                            <div class="summary-card-content"><span>1</span><br>Urgent</div>
                        </div>
                        <hr>
                        <div>
                            <div class="date">October 16, 2022</div>
                            <div class="deadline">Upcoming Deadline</div>
                        </div>
                    </div>
                    <div class="summary-card-3">
                        <span>1</span>Tasks in Board
                    </div>
                    <div class="summary-card-3">
                        <span>1</span>Tasks in Progress
                    </div>
                    <div class="summary-card-3">
                        <span>1</span>Awaiting Feedback
                    </div>
                </div>
            </div>
            <div class="summary-col">
                Good morning,
                <div>John Doe</div>
            </div>
        </div>
    `
}
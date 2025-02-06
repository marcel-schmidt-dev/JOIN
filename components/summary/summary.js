/**
 * Imports required functions and modules.
 */
import returnIcon from '../icons.js';
import { returnBoard, getAuthUser, checkAuth } from '../firebase.js';

/**
 * Listens for the DOM content to be fully loaded and then renders the summary template.
 */
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth();
  await renderSummaryTemplate();
});

/**
 * Gets the most relevant due date from the list of tasks.
 * If there are overdue tasks, it selects the earliest overdue task.
 * Otherwise, it selects the earliest upcoming task.
 *
 * @param {Array} tasks - An array of task objects, each containing a dueDate property.
 * @returns {string} - A string representing the most relevant due date in the format "Month Day, Year".
 */
function getRelevantDueDate(tasks) {
  if (tasks && tasks.length > 0) {
    const today = new Date();
    const parsedDueDates = tasks.map(({ dueDate }) => new Date(dueDate));
    const overdueDates = filterOverdueDates(parsedDueDates, today);
    const selectedDate = overdueDates.length ? getEarliestDate(overdueDates) : getEarliestDate(parsedDueDates);
    return formatDate(selectedDate);
  } else {
    return formatDate(new Date());
  }
}

/**
 * Filters an array of dates to return only those that are overdue.
 *
 * @param {Date[]} dates - An array of Date objects to be filtered.
 * @param {Date} today - The current date to compare against.
 * @returns {Date[]} An array of Date objects that are before the current date.
 */
function filterOverdueDates(dates, today) {
  return dates.filter((date) => date < today);
}

/**
 * Returns the earliest date from an array of dates.
 *
 * @param {Date[]} dates - An array of Date objects.
 * @returns {Date} The earliest date in the array.
 */
function getEarliestDate(dates) {
  return dates.sort((a, b) => a - b)[0];
}

/**
 * Formats a given date into a string with the format "Month Day, Year".
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Renders the summary template with key metrics at a glance, including task counts
 * and the user's welcome message.
 *
 * @returns {Promise<void>} - A promise that resolves once the summary template is rendered.
 */
async function renderSummaryTemplate() {
  let board = await returnBoard();
  const user = await getAuthUser();
  let urgentTasks = [];
  let allTasks = [];
  let contentRef;

  if (!board) {
    board = { todo: [], inProgress: [], done: [], awaitFeedback: [] };
    Object.keys(board).forEach((key) => {
      board[key].forEach((task) => {
        allTasks.push(task);
        if (task.priority === 'urgent') urgentTasks.push(task);
      });
    });
  }

  while ((contentRef = document.querySelector('.content')) === null) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  contentRef.innerHTML = returnSummaryTemplate(user, board, allTasks, urgentTasks);
}

/**
 * Generates the HTML template for the summary page.
 * @param {Object} user - The user object containing user information.
 * @param {string} user.displayName - The display name of the user.
 * @param {Object} board - The board object containing task information.
 * @param {Array<Object>} allTasks - The array of all tasks.
 * @param {Array<Object>} urgentTasks - The array of urgent tasks.
 * @returns {string} The HTML string for the summary template.
 */
function returnSummaryTemplate(user, board, allTasks, urgentTasks) {
  return /*html*/ `
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
              <div class="welcome">
                  Good morning,
                  <div>${user.displayName ? user.displayName : 'Guest'}</div>
              </div>
          </div>
      </div>
  </div>
`;
}

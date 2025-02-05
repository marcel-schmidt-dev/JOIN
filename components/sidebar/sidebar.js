/**
 * Imports required functions and modules.
 */
import returnIcon from '../icons.js';
import { getAuthUser } from '../firebase.js';

/**
 * Generates and returns the sidebar HTML structure.
 * This function creates the sidebar based on the current user's authentication status.
 * It includes navigation links to different pages and a footer with links to the privacy policy and legal notice.
 *
 * @returns {Promise<string>} - A promise that resolves to the HTML string for the sidebar.
 */
export default async function returnSidebar() {
  const urlPath = window.location.pathname;

  const user = await getAuthUser();

  return /*html*/ `
        <div class="sidebar">
            <a class="logo-head" href="./summary.html"> ${returnIcon('logo-light')}</a>
            ${
              user
                ? ` 
                <menu>
                    <a class="${urlPath === '/summary.html' ? 'active' : ''}" href="./summary.html">${returnIcon('summary')} Summary</a>
                    <a class="${urlPath === '/add-task.html' ? 'active' : ''}" href="./add-task.html">${returnIcon('add-task')} Add Task</a>
                    <a class="${urlPath === '/board.html' ? 'active' : ''}" href="./board.html">${returnIcon('board')} Board</a>
                    <a class="${urlPath === '/contacts.html' ? 'active' : ''}" href="./contacts.html">${returnIcon('contacts')} Contacts</a>
                </menu>`
                : ''
            }
            <footer>
              <a href="./privacy-policy.html"  >Privacy Policy</a>
              <a href="./legal-notice.html"  >Legal notice</a>
            </footer>
        </div>
    `;
}

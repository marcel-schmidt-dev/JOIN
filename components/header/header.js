import returnIcon from "../icons.js";
import { getAuthUser, signOutUser } from "../firebase.js";
import { getInitialsFromName } from "../utility-functions.js";

window.signOutUser = signOutUser;
window.toggleMenu = toggleMenu;

/**
 * Returns the header HTML template.
 * Displays the application title, logo, and user menu if the user is authenticated.
 * @returns {Promise<string>} The HTML template for the header.
 */
export default async function returnHeader() {
  const user = await getAuthUser();
  const displayName = user?.displayName || "Guest";

  return /*html*/ `
    <header>
      <span>Kanban Projekt Management Tool</span>
      
      ${returnIcon("logo-dark")}
      
      <div>
        ${
          user
            ? /*html*/ `
            <a href="./help.html">${returnIcon("help")}</a>
            <div class="user">
              <button onclick="toggleMenu(event)">
                ${getInitialsFromName(displayName)}
              </button>
              <div class="user-menu">
                <a href="./legal-notice.html">Legal Notice</a>
                <a href="./privacy-policy.html">Privacy Policy</a>
                <span onclick="signOutUser()">Logout</span>
              </div>
            </div>`
            : ""
        }
      </div>
    </header>
  `;
}

/**
 * Toggles the visibility of the user menu.
 * @param {Event} e - The event object triggered by clicking the user button.
 */
function toggleMenu(e) {
  const userRef = e.target.parentElement;
  userRef.classList.toggle("open");
}

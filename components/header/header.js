import returnIcon from "../icons.js";
import { getAuthUser, signOutUser } from "../firebase.js";
import { getInitialsFromName } from "../utility-functions.js";

window.signOutUser = signOutUser;
window.toggleMenu = toggleMenu;

export default async function returnHeader() {
    const user = await getAuthUser();
    let displayName;
    if (user) {
        displayName = user.displayName ? user.displayName : 'Guest';
    } else {
        displayName = null;
    }

    return /*html*/`
        <header>
            <span>Kanban Projekt Management Tool</span>
            ${returnIcon('logo-dark')}
            <div>
                ${displayName ? /*html*/ `
                    <a href="./help.html">${returnIcon('help')}</a>
                    <div class="user">
                        <button onclick="toggleMenu(event)">${getInitialsFromName(displayName)}</button>
                        <div class="user-menu">
                            <a href="./legal-notice.html">Legal Notice</a>
                            <a href="./privacy-policy.html">Privacy Policy</a>
                            <span onclick="signOutUser()">Logout</span>
                        </div>
                    </div>`  : ''}
            </div>
        </header>
    `;
}

function toggleMenu(e) {
    const userRef = e.target.parentElement;
    userRef.classList.toggle('open');
}
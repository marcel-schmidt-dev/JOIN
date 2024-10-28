import returnIcon from "../icons.js";
import { checkAuthStatus, getAuthUser } from "../firebase.js";
import { getInitialsFromName } from "../utility-functions.js";

export default async function returnHeader() {
    const user = await getAuthUser();
    const displayName = user ? user.displayName : 'Guest';
    return /*html*/`
        <header>
            <span>Kanban Projekt Management Tool</span>
            ${returnIcon('logo-dark')}
            <div>
                <a href="./help.html">${returnIcon('help')}</a>
                <button>${getInitialsFromName(displayName)}</button>
            </div>
        </header>
    `;
}
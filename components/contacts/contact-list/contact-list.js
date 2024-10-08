import { getContacts } from "../../firebase.js";
import returnIcon from "../../icons.js";
import { getInitialsFromName } from "../../utility-functions.js";

export default async function returnContactList() {

    const contactList = Object.values(await getContacts());

    return /*html*/`
        <div class="contact-list">
            <div class="button-container">
                <button>Add new contact ${returnIcon('add-user')}</button>
            </div>
            <div class="list-content">
                ${returnContactListTemplate(contactList)}
            </div>
        </div>
    `
}

function returnContactListTemplate(contactList) {
    let currentLetter = '';
    let htmlList = '';

    const sortedContacts = contactList.sort((a, b) => a.fullName.localeCompare(b.fullName));

    sortedContacts.forEach(contact => {
        const firstLetter = contact.fullName.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            htmlList += `<div class="letter">${currentLetter}</div>`;
        }
        htmlList += /*html*/`
            <div class="contact">
                <div class="initials-bubble" style="background-color: ${contact.userColor}">
                    ${getInitialsFromName(contact.fullName)}
                </div >
                <div class="details">
                    ${contact.fullName}<br>
                    <span>${contact.email}</span>
                </div>
            </div >
        `
    });

    return htmlList;
}
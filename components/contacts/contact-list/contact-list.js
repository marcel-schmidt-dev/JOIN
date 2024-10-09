import returnIcon from "../../icons.js";
import { getInitialsFromName } from "../../utility-functions.js";

export default function returnContactListTemplate(contactList) {
    return /*html*/`
        <div class="contact-list">
            <div class="button-container">
                <button>Add new contact ${returnIcon('add-user')}</button>
            </div>
            <div class="list-content">
                ${returnContactList(contactList)}
            </div>
        </div>
    `
}

function returnContactList(contactList) {
    let currentLetter = '';
    let htmlList = '';

    const sortedContacts = contactList.sort((a, b) => a.fullName.localeCompare(b.fullName));

    sortedContacts.forEach(contact => {
        const firstLetter = contact.fullName.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            htmlList += `<div class="letter">${currentLetter}</div><hr>`;
        }
        htmlList += /*html*/`
            <div class="contact" onclick="showContactDetails('${contact.id}')">
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
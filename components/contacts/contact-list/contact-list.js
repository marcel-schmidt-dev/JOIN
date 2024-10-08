import { getContacts } from "../../firebase.js";

export default async function returnContactList() {

    const contactList = Object.values(await getContacts());

    return /*html*/`
        <div class="contact-list">
            <button>Add new contact</button>
            <div class="list">
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
        htmlList += `<div class="contact">${contact.fullName}</div>`;
    });

    return htmlList;
}
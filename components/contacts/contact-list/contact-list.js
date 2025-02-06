import returnIcon from "../../icons.js";
import { getInitialsFromName } from "../../utility-functions.js";

/**
 * Returns the HTML template for the contact list.
 * @param {Array} contactList - An array of contact objects.
 * @returns {string} The HTML template for the contact list.
 */
export default function returnContactListTemplate(contactList) {
  return /*html*/ `
        <div class="contact-list">
            <div class="button-container">
                <button onclick="handleContactOverlayTemplate()"><span>Add new contact</span> ${returnIcon("add-user")}</button>
            </div>
            <div class="list-content">
                ${returnContactList(contactList)}
            </div>
        </div>
    `;
}

/**
 * Generates the HTML for the sorted contact list with alphabetical groupings.
 * @param {Array} contactList - An array of contact objects.
 * @param {string} contactList[].id - The unique ID of the contact.
 * @param {string} contactList[].fullName - The full name of the contact.
 * @param {string} contactList[].userColor - A color associated with the contact.
 * @param {string} contactList[].email - The email address of the contact.
 * @returns {string} The HTML for the contact list, sorted and grouped alphabetically.
 */
function returnContactList(contactList) {
  let currentLetter = ""; // Tracks the current alphabetical letter for grouping
  let htmlList = ""; // The resulting HTML for the contact list

  // Sort contacts alphabetically by full name
  const sortedContacts = contactList.sort((a, b) => a.fullName.localeCompare(b.fullName));

  // Generate the HTML for each contact
  sortedContacts.forEach((contact) => {
    const firstLetter = contact.fullName.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      htmlList += `<div class="letter">${currentLetter}</div><hr>`;
    }
    htmlList += /*html*/ `
            <div class="contact" onclick="showContactDetails('${contact.id}')" data-id="${contact.id}">
                <div class="initials-bubble" style="background-color: ${"#" + contact.userColor}">
                    ${getInitialsFromName(contact.fullName)}
                </div>
                <div class="details">
                    ${contact.fullName}<br>
                    <span>${contact.email}</span>
                </div>
            </div>
        `;
  });

  return htmlList;
}

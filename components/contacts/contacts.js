import returnContactListTemplate from "./contact-list/contact-list.js";
import { getContacts } from "../firebase.js";
import getContactDetailsTemplate from "./contact-details/contact-details.js";
import getContactOverlayTemplate from "./contact-overlay/contact-overlay.js";
import { checkAuth } from "../firebase.js";

window.showContactDetails = showContactDetails;

let contactList;

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  renderContacts();
});

/**
 * Displays the details of a specific contact.
 * @param {string} id - The ID of the contact to display.
 */
export function showContactDetails(id) {
  const contact = contactList.find((contact) => contact.id.toString() === id.toString());

  const contentRef = document.querySelector(".content");
  let contactSectionRef = contentRef.querySelector(".contact-details-container");

  if (contactSectionRef) {
    contactSectionRef.innerHTML = getContactDetailsTemplate(contact);
  } else {
    contentRef.innerHTML += `<div class="contact-details-container">${getContactDetailsTemplate(
      contact
    )}</div>`;
  }

  const contactListItems = document.querySelectorAll(".contact");
  contactListItems.forEach((item) => item.classList.remove("active"));

  const activeContact = document.querySelector(`.contact[data-id="${id}"]`);
  if (activeContact) {
    activeContact.classList.add("active");
  }
}

/**
 * Displays the contact overlay for adding or editing a contact.
 * @param {string|boolean} id - The ID of the contact to edit, or `false` to add a new contact.
 */
export function handleContactOverlayTemplate(id = false) {
  let contact = id ? contactList.find((contact) => contact.id.toString() === id.toString()) : false;

  const contentRef = document.querySelector(".content");
  contentRef.innerHTML = getContactOverlayTemplate(contact);
}

/**
 * Fetches and renders the contact list.
 * Displays a loading spinner if necessary while waiting for the contacts.
 */
export async function renderContacts() {
  let contentRef;
  while ((contentRef = document.querySelector(".content")) === null) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for content container to load
  }

  contentRef.innerHTML = ""; // Clear existing content

  contactList = await getContacts(); // Fetch contacts from the database

  contentRef.innerHTML += returnContactListTemplate(contactList); // Render the contact list
  renderContactHeader(); // Render the header
}

/**
 * Renders the header section for the contact page.
 */
async function renderContactHeader() {
  const contentRef = document.querySelector(".content");

  contentRef.innerHTML += /*html*/ `
    <div class="contact-details-container">
      <div class="header-container initial">
        <div class="contact-header">
          <h1>Contacts</h1>
          <div class="separator"></div>
          <p>Better with team</p>
          <div class="second-separator"></div>
        </div>
      </div>
    </div>
  `;
}

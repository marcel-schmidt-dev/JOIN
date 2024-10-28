import returnContactListTemplate from "./contact-list/contact-list.js";
import { getContacts } from "../firebase.js";
import getContactDetailsTemplate from "./contact-details/contact-details.js";
import getContactOverlayTemplate from "./contact-overlay/contact-overlay.js";
import { getAuthUser } from "../firebase.js";
window.showContactDetails = showContactDetails;

let contactList;

document.addEventListener("DOMContentLoaded", () => {
  const user = getAuthUser();

  if (!user) {
    window.location.href = "/index.html";
  } else {
    renderContactHeader();
    renderContacts();
  }
});

export function showContactDetails(id) {
  const contact = contactList.find((contact) => contact.id.toString() === id.toString());

  const contentRef = document.querySelector(".content");
  let contactSectionRef = contentRef.querySelector(".contact-details-container");

  if (contactSectionRef) {
    contactSectionRef.innerHTML = getContactDetailsTemplate(contact);
  } else {
    contentRef.innerHTML += `<div class="contact-details-container">${getContactDetailsTemplate(contact)}</div>`;
  }

  const contactListItems = document.querySelectorAll(".contact");
  contactListItems.forEach(item => item.classList.remove("active"));
  const activeContact = document.querySelector(`.contact[data-id="${id}"]`);
  if (activeContact) {
    activeContact.classList.add("active");
  }
}

export function handleContactOverlayTemplate(id = false) {
  let contact;

  if (id) {
    contact = contactList.find((contact) => contact.id.toString() === id.toString());
  } else {
    contact = false;
  }

  const contentRef = document.querySelector(".content");
  contentRef.innerHTML = "";
  contentRef.innerHTML += getContactOverlayTemplate(contact);
}

export async function renderContacts() {
  let contentRef;
  while ((contentRef = document.querySelector(".content")) === null) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  contentRef.innerHTML = "";
  contactList = await getContacts();

  contentRef.innerHTML += returnContactListTemplate(contactList);
}

async function renderContactHeader() {
  let contentRef;
  while ((contentRef = document.querySelector(".content")) === null) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  contentRef.innerHTML += /*html*/`
      <div class="contact-details-container">
        <div class="header-container">
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
import returnContactListTemplate from "./contact-list/contact-list.js";
import { getContacts } from "../firebase.js";
import getContactDetailsTemplate from "./contact-details/contact-details.js";
import getContactOverlayTemplate from "./contact-overlay/contact-overlay.js";
window.showContactDetails = showContactDetails;

let contactList;

document.addEventListener("DOMContentLoaded", async () => {
  await renderContacts();
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
  const contentRef = document.querySelector(".content");

  contentRef.innerHTML = "";
  contactList = await getContacts();

  contentRef.innerHTML += returnContactListTemplate(contactList);
}

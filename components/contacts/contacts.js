import returnContactListTemplate from "./contact-list/contact-list.js";
import { getContacts } from "../firebase.js";
import getContactInfosTemplate from "./contact-details/contact-details.js";
import getEditContactTemplate from "./edit-contact/edit-contact.js";

window.showContactDetails = showContactDetails;

let contactList;

document.addEventListener("DOMContentLoaded", async () => {
  await renderContacts();
});

export function showContactDetails(id) {
  const contact = contactList.find((contact) => contact.id === id);

  const contentRef = document.querySelector(".content");
  const contactSectionRef = contentRef.querySelector(".contact-section");
  if (contactSectionRef) contactSectionRef.remove();

  contentRef.innerHTML += getContactInfosTemplate(contact);
}

export default function edit(id) {
  const contact = contactList.find((contact) => contact.id === id);
  const contentRef = document.querySelector(".content");
  contentRef.innerHTML = "";
  contentRef.innerHTML += getEditContactTemplate(contact);
}

export async function renderContacts() {
  const contentRef = document.querySelector(".content");

  contentRef.innerHTML = "";
  contactList = await getContacts();

  contentRef.innerHTML += returnContactListTemplate(contactList);
}

import returnContactListTemplate from "./contact-list/contact-list.js";
import { getContacts } from "../firebase.js";
import getContactDetailsTemplate from "./contact-details/contact-details.js";
import getContactOverlayTemplate from "./contact-overlay/contact-overlay.js";
import { showToast } from "../toast/toast.js";
import returnIcon from "../icons.js";
window.showContactDetails = showContactDetails;

let contactList;

document.addEventListener("DOMContentLoaded", async () => {
  await renderContacts();
});

export function showContactDetails(id) {
  const contact = contactList.find((contact) => contact.id.toString() === id.toString());

  const contentRef = document.querySelector(".content");
  const contactSectionRef = contentRef.querySelector(".contact-section");
  if (contactSectionRef) contactSectionRef.remove();

  contentRef.innerHTML += getContactDetailsTemplate(contact);
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

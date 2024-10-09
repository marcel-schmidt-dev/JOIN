import returnContactListTemplate from "./contact-list/contact-list.js";
import { getContacts } from "../firebase.js";
import getContactInfosTemplate from "./contact-details/contact-details.js";

window.showContactDetails = showContactDetails;

let contactList;

document.addEventListener("DOMContentLoaded", async function () {
  const contentRef = document.querySelector(".content");
  contactList = await getContacts();

  contentRef.innerHTML += returnContactListTemplate(contactList);
});

export function showContactDetails(id) {

  const contact = contactList.find(contact => contact.id === id);

  const contentRef = document.querySelector(".content");
  const contactSectionRef = contentRef.querySelector('.contact-section');
  if (contactSectionRef) contactSectionRef.remove();

  contentRef.innerHTML += getContactInfosTemplate(contact);

}
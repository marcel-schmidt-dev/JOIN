import { renderContacts } from "../contacts/contacts.js";
window.renderContacts = renderContacts;

export function showToast(message, icon) {
  const contentRef = document.querySelector(".content");
  contentRef.innerHTML += /*html*/ `
        <p class="toast">${message}</p>
    `;
  button = document.getElementsByClassName("toast").add("d-none");
  setTimeout(button, 3000);
}

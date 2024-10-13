import { renderContacts } from "../contacts/contacts.js";
window.renderContacts = renderContacts;

export function showToast(message, icon) {
  const contentRef = document.querySelector(".content");
  contentRef.innerHTML += /*html*/ `
        <p class="toast">${message}</p>
    `;

  setTimeout(() => {
    const toastRef = document.querySelector(".toast");
    toastRef.remove();
  }, 3000);
}

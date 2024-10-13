import { renderContacts } from "../contacts/contacts.js";
import returnIcon from "../icons.js";
window.renderContacts = renderContacts;

export function showToast(message, icon) {
  const contentRef = document.querySelector(".content");
  contentRef.innerHTML += /*html*/ `
        <div class="toast-container">
          <span>${message}</span>
          ${returnIcon(icon)}
        </div>
    `;

  setTimeout(() => {
    const toastRef = document.querySelector(".toast-container");
    toastRef.remove();
  }, 3000);
}

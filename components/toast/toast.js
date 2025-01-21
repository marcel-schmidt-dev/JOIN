import returnIcon from "../icons.js";

/**
 * Displays a toast notification with a message and an optional icon.
 * The toast will disappear after 3 seconds.
 *
 * @param {string} message - The message to be displayed in the toast notification.
 * @param {string} [icon] - The optional icon to be displayed alongside the message.
 *                           If not provided, no icon will be shown.
 */
export function showToast(message, icon) {
  const contentRef = document.querySelector(".content");

  contentRef.innerHTML += /*html*/ `
        <div class="toast-container">
          <span>${message}</span>
          ${icon ? returnIcon(icon) : ""}
        </div>
    `;

  setTimeout(() => {
    const toastRef = document.querySelector(".toast-container");
    toastRef.remove();
  }, 3000);
}

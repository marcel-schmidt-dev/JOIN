import returnIcon from "../icons.js";

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

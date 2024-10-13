export function showToast(message, icon) {
  const contentRef = document.querySelector(".content");
  contentRef.innerHTML += /*html*/ `
        <p class="toast">${message}</p>
    `;
}

import returnContactList from "./contact-list/contact-list.js";

document.addEventListener('DOMContentLoaded', async function () {
    const contentRef = document.querySelector('.content');

    contentRef.innerHTML += await returnContactList();
});
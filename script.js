import returnHeader from "./components/header/header.js";
import returnSidebar from "./components/sidebar/sidebar.js";

document.addEventListener('DOMContentLoaded', function () {
    const urlPath = window.location.pathname;

    if (urlPath !== '/' && urlPath !== '/index.html') {
        document.body.innerHTML += /*html*/`
        <div class="app">
            ${returnSidebar()}
            <div class="content-container">
                ${returnHeader()}
                <div class="content"></div>
            </div>
        </div>`
    }
});
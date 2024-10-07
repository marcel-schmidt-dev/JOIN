import returnHeader from "./components/header.js";
import returnSidebar from "./components/sideBar.js";

document.addEventListener('DOMContentLoaded', function () {
    const urlPath = window.location.pathname;
    console.log(urlPath);

    if (urlPath !== '/' && urlPath !== '/index.html') {
        document.body.innerHTML += /*html*/`
        <div class="app">
            ${returnSidebar()}
            <div>
                ${returnHeader()}
                <div class="content"></div>
            </div>
        </div>
    `
    }
});
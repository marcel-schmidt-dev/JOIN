import returnHeader from "./components/header/header.js";
import returnSidebar from "./components/sidebar/sidebar.js";

document.addEventListener('DOMContentLoaded', function () {
    const urlPath = window.location.pathname;


    document.body.innerHTML += /*html*/`
        <div class="app">
            ${urlPath !== '/' && urlPath !== '/index.html' ? returnSidebar() : ''}
            <div class="content-container">
            ${urlPath !== '/' && urlPath !== '/index.html' ? returnHeader() : ''}
                <div class="content ${!urlPath !== '/' && !urlPath !== '/index.html' ? 'home-content' : ''}"></div>
            </div>
        </div>`;
});
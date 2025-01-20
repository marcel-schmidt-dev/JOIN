import returnHeader from "./components/header/header.js";
import returnSidebar from "./components/sidebar/sidebar.js";
import { returnPath } from "./components/utility-functions.js";

document.body.innerHTML += /*html*/ `
    <div class="app">
        ${returnPath() !== "/" && returnPath() !== "/index.html" ? await returnSidebar() : ""}
        <div class="content-container">
        ${returnPath() !== "/" && returnPath() !== "/index.html" ? await returnHeader() : ""}
            <div class="content ${
              !returnPath() !== "/" && !returnPath() !== "/index.html" ? "home-content" : ""
            }"></div>
        </div>
    </div>`;

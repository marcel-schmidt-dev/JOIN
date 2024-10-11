import returnIcon from "./../../icons.js";
import { getInitialsFromName } from "./../../utility-functions.js";
import { handleContactOverlayTemplate } from "../contacts.js";
import { handleDeleteContact } from "../contacts.js";

window.handleDeleteContact = handleDeleteContact;
window.handleContactOverlayTemplate = handleContactOverlayTemplate;

export default function getContactDetailsTemplate(contactInfos) {
  return /*html*/ `
  
      <section class="contact-section">
      <div class="arrow-left">${returnIcon("arrow-left")} </div>
      <div class="contact-header">
      <h1>Contacts</h1>
      <div class="separator"></div>
      <p>Better with team</p>
      <div class="second-separator"></div>
    </div>
        <div class="contact-second">
          <div class="contact-initials" style="background-color: ${"#" + contactInfos.userColor}">
            <h2 class="initials">${getInitialsFromName(contactInfos.fullName)}</h2>
          </div>
  
          <div class="contact-action">
            <div class="names">
              ${contactInfos.fullName}
            </div>
            <div class= button-center>
              <button onclick="handleContactOverlayTemplate(${contactInfos.id})" class="btn"> ${returnIcon("pen-outline")} Edit</button>
              <button onclick="handleDeleteContact(${contactInfos.id})" class="btn">  ${returnIcon("trash-outline")}Delete</button>
            </div>
          </div>
        </div>
        <div class="contact-information">
          <span>Contact Information</span>
          <div class="contact-details">
            <span>E-Mail</span>
            <a href="mailto:${contactInfos.email}">${contactInfos.email}</a>
            <span>Phone</span>
            <a href="tel:${contactInfos.phone}">${contactInfos.phone}</a>
          </div>
        </div>
         <div class="burger-menu">${returnIcon("burger-menu")}</div>
      </section>
  `;
}

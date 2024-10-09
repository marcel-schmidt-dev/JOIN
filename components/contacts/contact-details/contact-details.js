import returnIcon from "./../../icons.js";
import { getInitialsFromName } from "./../../utility-functions.js";
export default function getContactInfosTemplate(contactInfos) {
  console.log(contactInfos);

  return /*html*/ `
   
      <section class="contact-section">
      <div class="contact-header">
      <h1>Contacts</h1>
      <div class="separator"></div>
      <p>Better with team</p>
    </div>
        <div class="contact-second">
          <div class="contact-initals" style="background-color: ${contactInfos.userColor}">
            <h2 class="initals">${getInitialsFromName(contactInfos.fullName)}</h2>
          </div>
  
          <div class="contact-action">
            <div class="names">
              <p>${contactInfos.fullName}</p>
            </div>
            <div class= button-center>
              <button onclick="edit()" class="btn"> ${returnIcon("pen-outline")} Edit</button>
              <button onclick="deleteContact()" class="btn"> ${returnIcon("trash-outline")}Delete</button>
            </div>
          </div>
        </div>
        <div class="contact-information">
          <span>Contact Information</span>
          <div class="contact-details">
            <span>E-Mail</span>
            <a href="">${contactInfos.email}</a>
            <span>Phone</span>
            <a href="">${contactInfos.number}</a>
          </div>
        </div>
      </section>
  `;
}

import returnIcon from "../../icons.js";
import { handleDeleteContact } from "../contacts.js";
import { editContact } from "../../firebase.js";
import { renderContacts } from "../contacts.js";
import { getInitialsFromName } from "../../utility-functions.js";

export default function getContactOverlayTemplate(contactInfos) {
  function handleEditContact(id, userColor) {
    const fullName = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("number").value;
    editContact(id, fullName, email, phone, userColor);
    renderContacts();
  }

  window.handleDeleteContact = handleDeleteContact;
  window.handleEditContact = handleEditContact;
  window.renderContacts = renderContacts;
  window.validateForm = validateForm;

  return /*html*/ `
        <div class="edit-contact">
      <div class="overlay-add-contact">
        <div class="add-contact">
          <div class="description">
            <div class="join-container">
              ${returnIcon("logo-light")}
            </div>
            <div class="description-box">
              <h1>${contactInfos ? "Edit Contact" : "Add Contact"}</h1>
               ${!contactInfos && "<p>Tasks are better with team!</p>"}
              <div class="separator"></div>
            </div>
          </div>
        </div>
        <div class="person-container">
          <div class="person-icon" style="background-color: ${contactInfos && "#" + contactInfos.userColor}">
            ${contactInfos ? getInitialsFromName(contactInfos.fullName) : returnIcon("user-outline")}
          </div>
        </div>
        <div class="input-container">
          <div class="x-container" onclick="renderContacts()">
            ${returnIcon("x")}
          </div>
          <form class="form" name="form-validation" action="" onsubmit="validateForm()" >
            <div class="form-name">
              <input class="name-input" id="name" required type="text" name="Name" placeholder="Name" value="${contactInfos ? contactInfos.fullName : ""}" />
              ${returnIcon("user-outline")}
            </div>
            <div class="form-email">
              <input class="name-input" id="email" required type="text" name="Email" placeholder="Email" value="${contactInfos ? contactInfos.email : ""}" />
              ${returnIcon("mail-outline")}
            </div>
            <div class="form-number">
              <input class="name-input" id="number" required type="text" name="Phone" placeholder="Phone" value="${contactInfos ? contactInfos.phone : ""}" />
              ${returnIcon("tel-outline")}
            </div>
          </form>
          <div class="button-container">
            <div class="button-cancel-container">
              ${
                contactInfos
                  ? `<button class="button-delete" onclick="handleDeleteContact(${contactInfos.id})">
                Delete
                ${returnIcon("trash-outline")}
              </button>`
                  : `<button class="button-delete" onclick="renderContacts()">  
                    Cancel ${returnIcon("x")} </button>`
              } </div>
            <div class="button-save-container" >
              <button class="button-save" onclick="handleEditContact(${contactInfos.id}, '${contactInfos.userColor}')">
                ${contactInfos ? "Save" : "Create Contact"}
                ${returnIcon("check")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}

export function validateForm() {
  let name = document.forms["form-validation"]["Name"].value;
  let nameValidation = /^[a-zA-ZäöüÄÖÜß\s-]+$/;
  if (!nameValidation.test(name) || name.length < 10) {
    alert("Ein vollständiger Name muss angegeben werden");
    return false;
  }

  let email = document.forms["form-validation"]["Email"].value;
  let emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValidation.test(email)) {
    alert("Eine gültige E-Mail Adresse muss angegeben werden");
    return false;
  }

  let phone = document.forms["form-validation"]["Phone"].value;
  let phoneValidation = /^[0-9]+$/;
  if (!phoneValidation.test(phone) || phone.length < 10) {
    alert("Eine gültige Handynummer mit mind. 10 Ziffern muss angegeben werden");
    return false;
  }
  return true;
}

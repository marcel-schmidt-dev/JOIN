import returnIcon from "../../icons.js";
import { editContact } from "../../firebase.js";
import { renderContacts } from "../contacts.js";
import { getInitialsFromName } from "../../utility-functions.js";
import { addContact, deleteContact } from "../../firebase.js";
import { showToast } from "../../toast/toast.js";

export default function getContactOverlayTemplate(contactInfos) {
  window.handleDeleteContact = handleDeleteContact;
  window.handleEditContact = handleEditContact;
  window.renderContacts = renderContacts;
  window.handleAddContact = handleAddContact;
  window.addContact = addContact;

  return /*html*/ `
    <div class="edit-contact">
      <div class="card">
        <div class="header-container">
          ${returnIcon("logo-light")}
          <h1>${contactInfos ? "Edit Contact" : "Add Contact"}</h1>
          ${!contactInfos ? "<p>Tasks are better with team!</p>" : ""}
          <hr>
        </div>
        <div class="form-container">
        <div class="close-container" onclick="renderContacts()">
            ${returnIcon("x")}
        </div>
        <div class="form">
          <div>
            <div class="bubble-container" style="background-color: ${contactInfos ? "#" + contactInfos.userColor : ""}">
              ${contactInfos ? `<span>${getInitialsFromName(contactInfos.fullName)}</span>` : returnIcon("user-outline")}
            </div>
          </div>
          <div>
            <div class="input-content">
            <div class="input-container" id="input-container-name">
              <input id="name" type="text" name="name" placeholder="Name" value="${contactInfos ? contactInfos.fullName : ""}" />
              ${returnIcon("user-outline")}
            </div>
            <div class="request-container">
              <p id="name-requested">Vollständiger Name erforderlich</p>
             </div>
            </div>
            <div class="input-content">
            <div class="input-container" id="input-container-email">
              <input id="email" type="text" name="Email" placeholder="Email" value="${contactInfos ? contactInfos.email : ""}" />
              ${returnIcon("mail-outline")}
            </div>
            <p id="email-requested">Gültige Email-Adresse erforderlich</p>
            </div>  
            <div class="input-content">   
            <div class="input-container" id="input-container-phone">
              <input id="number" type="text" name="Phone" placeholder="Phone" value="${contactInfos ? contactInfos.phone : ""}" />
              ${returnIcon("tel-outline")}
            </div>
            <p id="phone-requested">Gültige Handynummer erforderlich</p>
            </div>
            <div class="button-container">
              ${
                contactInfos
                  ? `<button class="button-delete" onclick="handleDeleteContact('${contactInfos.id}')">Delete${returnIcon("trash-outline")}</button>`
                  : `<button class="button-cancel" onclick="renderContacts()">Cancel ${returnIcon("x")} </button>`
              }
              ${
                contactInfos
                  ? `<button class="button-save" onclick="handleEditContact('${contactInfos.id}', '${contactInfos.userColor}')">Save${returnIcon("check")}</button>`
                  : `<button class="button-save" onclick="handleAddContact()">Create contact ${returnIcon("check")} </button>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function validateForm(fullName, email, phone) {
  const nameRequest = document.getElementById("name-requested");
  const inputNameRequest = document.getElementById("input-container-name");
  let nameValidation = /^[a-zA-ZäöüÄÖÜß\s-]+$/;
  if (!nameValidation.test(fullName) || fullName.length < 10) {
    nameRequest.style.display = "block";
    inputNameRequest.style.borderColor = "red";
    return false;
  } else {
    nameRequest.style.display = "none";
    inputNameRequest.style.borderColor = "#d1d1d1";
  }

  const emailRequest = document.getElementById("email-requested");
  const inputEmailRequest = document.getElementById("input-container-email");
  let emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValidation.test(email)) {
    emailRequest.style.display = "block";
    inputEmailRequest.style.borderColor = "red";
    return false;
  } else {
    emailRequest.style.display = "none";
    inputEmailRequest.style.borderColor = "#d1d1d1";
  }

  const phoneRequest = document.getElementById("phone-requested");
  const inputPhoneRequest = document.getElementById("input-container-phone");
  let phoneValidation = /^[0-9]+$/;
  if (!phoneValidation.test(phone) || phone.length < 10) {
    phoneRequest.style.display = "block";
    inputPhoneRequest.style.borderColor = "red";
    return false;
  } else {
    phoneRequest.style.display = "none";
    inputPhoneRequest.style.borderColor = "#d1d1d1";
  }
  return true;
}

function handleAddContact() {
  const fullName = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value;

  if (validateForm(fullName, email, phone)) {
    addContact(fullName, email, phone);
    renderContacts();
    showToast("Contact successfully Created", "add-user");
  }
}

function handleEditContact(id, userColor) {
  const fullName = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value;
  editContact(id, fullName, email, phone, userColor);
  renderContacts();
  showToast("Contact successfully Edited", "pen");
}

export function handleDeleteContact(id) {
  deleteContact(id);
  renderContacts();
  showToast("Contact successfully Deleted", "trash-outline");
}

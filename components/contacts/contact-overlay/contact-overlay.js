import returnIcon from "../../icons.js";
import { editContact } from "../../firebase.js";
import { renderContacts, showContactDetails } from "../contacts.js";
import { getInitialsFromName } from "../../utility-functions.js";
import { addContact, deleteContact } from "../../firebase.js";
import { showToast } from "../../toast/toast.js";

/**
 * Generates the HTML template for the contact overlay (Add/Edit Contact).
 * @param {Object|null} contactInfos - Information about the contact (null if adding a new contact).
 * @param {string} [contactInfos.id] - The unique ID of the contact.
 * @param {string} [contactInfos.fullName] - The full name of the contact.
 * @param {string} [contactInfos.email] - The email address of the contact.
 * @param {string} [contactInfos.phone] - The phone number of the contact.
 * @param {string} [contactInfos.userColor] - The background color associated with the contact.
 * @returns {string} The HTML template for the contact overlay.
 */
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
                    : `<button class="button-cancel button-none" onclick="renderContacts()">Cancel ${returnIcon("x")} </button>`
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
      </div>
    </div>`;
}

/**
 * Validates the form fields for adding/editing a contact.
 * @param {string} fullName - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function validateForm(fullName, email, phone) {
  const formValidations = [
    { value: fullName, regex: /^[a-zA-ZäöüÄÖÜß\s-]+$/, minLength: 10, element: "name" },
    { value: email, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, element: "email" },
    { value: phone, regex: /^(\+49[1-9][0-9]{8,11}|0[1-9][0-9]{8,11})$/, minLength: 10, element: "phone" },
  ];
  for (let { value, regex, minLength, element } of formValidations) {
    const request = document.getElementById(`${element}-requested`);
    const input = document.getElementById(`input-container-${element}`);
    if (!regex.test(value) || (minLength && value.length < minLength)) {
      request.style.display = "block";
      input.style.borderColor = "red";
      return false;
    } else {
      request.style.display = "none";
      input.style.borderColor = "#d1d1d1";
    }
  }
  return true;
}

/**
 * Handles the addition of a new contact.
 */
function handleAddContact() {
  const fullName = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value;

  if (validateForm(fullName, email, phone)) {
    const contactID = addContact(fullName, email, phone);
    renderContacts().then(() => showContactDetails(contactID));
    showToast("Contact successfully Created", "add-user");
  }
}

/**
 * Handles editing an existing contact.
 * @param {string} id - The ID of the contact to edit.
 * @param {string} userColor - The existing color of the contact.
 */
function handleEditContact(id, userColor) {
  const fullName = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value;
  if (validateForm(fullName, email, phone)) {
    editContact(id, fullName, email, phone, userColor)
      .then(() => renderContacts())
      .then(() => showToast("Contact successfully Edited", "pen"));
  }
}

/**
 * Handles deleting a contact.
 * @param {string} id - The ID of the contact to delete.
 */
export function handleDeleteContact(id) {
  deleteContact(id).then(() => renderContacts().then(() => showToast("Contact successfully Deleted", "trash-outline")));
}

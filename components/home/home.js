/**
 * Imports required modules and functions.
 */
import returnIcon from "../icons.js";
import { signIn, signInAnonymouslyUser, signUp } from "../firebase.js";
import { showToast } from "../toast/toast.js";

window.anonymouslyLogin = anonymouslyLogin;
window.renderRegister = renderRegister;
window.renderLogin = renderLogin;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;

/**
 * Initializes the app and sets up the default UI on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const contentRef = document.querySelector(".content");
  contentRef.innerHTML = returnHeaderTemplate();
  renderLogin();

  setTimeout(() => {
    document.querySelector(".logo-background").style.display = "none";
  }, 2000);
});

/**
 * Renders the login form and optionally displays additional buttons.
 * @param {boolean} [displayButtons] - Whether to display buttons for toggling views.
 */
function renderLogin(displayButtons) {
  const formRef = document.querySelector(".form-container");
  const btnContainerRef = document.querySelectorAll(".btn-container");

  if (displayButtons) {
    btnContainerRef.forEach((btn) => (btn.style.display = ""));
  }

  formRef.innerHTML = returnLoginTemplate();
}

/**
 * Renders the registration form and hides toggle buttons.
 */
function renderRegister() {
  const formRef = document.querySelector(".form-container");
  const btnContainerRef = document.querySelectorAll(".btn-container");
  btnContainerRef.forEach((btn) => (btn.style.display = "none"));

  formRef.innerHTML = returnRegisterTemplate();
}

/**
 * Handles user login.
 * @param {Event} e - The form submission event.
 */
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = await signIn(email, password);

  if (user) window.location.href = "/summary.html";
  else {
    const formRef = document.querySelector(".form");
    formRef.classList.add("error");
  }
}

/**
 * Handles anonymous login.
 */
async function anonymouslyLogin() {
  try {
    const user = await signInAnonymouslyUser();
    if (user) window.location.href = "/summary.html";
  } catch (error) {
    throw error;
  }
}

/**
 * Handles user registration.
 * @param {Event} e - The form submission event.
 */
async function handleRegister(e) {
  e.preventDefault();
  const { name, email, password, confirmPassword, checkPrivacy } = returnFieldValues();
  const errorRef = document.querySelector(".form .error-message");
  errorRef.innerText = "";
  const { errorMessages, returnState } = validateRegister(name, email, password, confirmPassword, checkPrivacy);
  if (!returnState) {
    errorRef.innerHTML = errorMessages;
    document.querySelector(".form").classList.add("error");
    return;
  }
  const user = await signUp(name, email, password);
  if (user) renderLogin(), showToast("You Signed Up successfully");
}

/**
 * Retrieves the values of the form fields.
 * @returns {Object} An object containing the values of the form fields.
 * @returns {string} name - The value of the name field.
 * @returns {string} email - The value of the email field.
 * @returns {string} password - The value of the password field.
 * @returns {string} confirmPassword - The value of the confirm password field.
 * @returns {boolean} checkPrivacy - The value of the privacy policy checkbox.
 */
function returnFieldValues() {
  const getField = (id) => document.getElementById(id).value;
  const name = getField("name");
  const email = getField("email");
  const password = getField("password");
  const confirmPassword = getField("confirm-password");
  const checkPrivacy = document.getElementById("check-privacy").checked;

  return { name, email, password, confirmPassword, checkPrivacy };
}

/**
 * Validates the registration form inputs.
 * @param {string} name - User's name.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {string} confirmPassword - Confirmation of the password.
 * @param {boolean} checkPrivacy - Whether the privacy policy was accepted.
 * @returns {{ errorMessages: string, returnState: boolean }} - Validation results.
 */
function validateRegister(name, email, password, confirmPassword, checkPrivacy) {
  let errorMessages = "",
    returnState = true;

  if (![name, email, password, confirmPassword].every(Boolean)) (errorMessages += "Fill all fields.<br>"), (returnState = false);
  if (!checkPrivacy) (errorMessages += "Accept the privacy policy.<br>"), (returnState = false);
  if (email && !/@/.test(email)) (errorMessages += "Enter a valid email.<br>"), (returnState = false);
  if (password.length < 6) (errorMessages += "Password must be at least 6 characters.<br>"), (returnState = false);
  if (password !== confirmPassword) (errorMessages += "Passwords do not match.<br>"), (returnState = false);

  return { errorMessages, returnState };
}

/**
 * Generates the header template for the home page.
 * @returns {string} The HTML string for the header template.
 */
function returnHeaderTemplate() {
  return /*html*/ `
    <div class="home">
      <div class="head">
        <div class="logo-container">
          <div class="logo">
            ${returnIcon("logo-dark")}
          </div>
        <div class="logo-background"></div>
      </div>
      <div class="btn-container">
        <span>Not a Join user?</span>
        <button onclick="renderRegister()">Sign up</button>
      </div>
    </div>
    <div class="content-container">
      <div class="form-container"></div>
      <div class="btn-container">
        <span>Not a Join user?</span>
        <button onclick="renderRegister()">Sign up</button>
      </div>
      <div class="sublinks">
      <a href="/privacy-policy.html">Privacy Policy</a>
        <a href="/legal-notice.html">Legal notice</a>
      </div>
    </div>
  </div>
`;
}

/**
 * Generates the login template for the login page.
 * @returns {string} The HTML string for the login template.
 */
function returnLoginTemplate() {
  return /*html*/ `
    <div class="login">
        <div class="header">
            <h1>Log in<hr></h1>
        </div>
        <form class="form" onsubmit=handleLogin(event)>
            <div class="inputs">
                <div class="input-container">
                    <input type="email" id="email" placeholder="Email" />
                    <span>
                        ${returnIcon("mail-outline")}
                    </span>
                </div>
                <div class="input-container">
                    <input type="password" id="password" placeholder="Password" />
                    <span>
                        ${returnIcon("lock")}
                    </span>
                </div>
            </div>
            <div class="error-message">Check your email and password. Please try again.</div>
            <div class="remember-me">
                <input type="checkbox" id="remember-me" />
                <label for="remember-me">Remember me</label>
            </div>
            <div class="button-container">
                <button class="btn" type="submit">Log in</button>
                <span class="btn" onclick="anonymouslyLogin()">Guest Log in</span>
            </div>
        </form>
    </div>
`;
}

/**
 * Generates the register template for the register page.
 * @returns {string} The HTML string for the register template.
 */
function returnRegisterTemplate() {
  return /*html*/ `
    <div class="register">
      <div class="header">
        <h1>Sign up<hr></h1>
        <button onclick="renderLogin(true)">${returnIcon("arrow-left")}</button>
      </div>
      <form class="form" onsubmit=handleRegister(event)>
        <div class="inputs">
          <div class="input-container">
            <input type="text" id="name" placeholder="Name" />
            <span>
                ${returnIcon("user-outline")}
            </span>
          </div>
          <div class="input-container">
              <input type="email" id="email" placeholder="Email" />
              <span>
                  ${returnIcon("mail-outline")}
              </span>
          </div>
          <div class="input-container">
              <input type="password" id="password" placeholder="Password" />
              <span>
                  ${returnIcon("lock")}
              </span>
          </div>
          <div class="input-container">
              <input type="password" id="confirm-password" placeholder="Confirm Password" />
              <span>
                  ${returnIcon("lock")}
              </span>
          </div>
        </div>
        <div class="error-message">Check your email and password. Please try again.</div>
        <div class="remember-me">
            <input type="checkbox" id="check-privacy" />
            <label for="check-privacy">I accept the <a href="/privacy-policy.html">Privacy Policy</a></label>
        </div>
        <div class="button-container">
            <button class="btn" type="submit">Sign up</button>
        </div>
      </form>
    </div>
    `;
}

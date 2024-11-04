import returnIcon from '../icons.js';
import { signIn, signInAnonymouslyUser, signUp } from '../firebase.js';
import { showToast } from '../toast/toast.js';
window.anonymouslyLogin = anonymouslyLogin;
window.renderRegister = renderRegister;
window.renderLogin = renderLogin;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;

document.addEventListener('DOMContentLoaded', function () {
    const contentRef = document.querySelector('.content');
    contentRef.innerHTML = /*html*/`
        <div class="home">
            ${returnHeader()}
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
    `
    renderLogin();

    setTimeout(() => {
        document.querySelector('.logo-background').style.display = 'none';
    }, 2000);
});

function returnHeader() {
    return /*html*/`
        <div class="head">
            <div class="logo-container">
                <div class="logo">
                    ${returnIcon('logo-dark')}
                </div>
                <div class="logo-background"></div>
            </div>
            
            <div class="btn-container">
                <span>Not a Join user?</span>
                <button onclick="renderRegister()">Sign up</button>
            </div>
        </div>
    `;
}

function renderLogin(displayBtns) {
    const formRef = document.querySelector('.form-container');
    const btnContainerRef = document.querySelectorAll('.btn-container');

    if (displayBtns) {
        btnContainerRef.forEach(btn => btn.style.display = '');
    }

    formRef.innerHTML = /*html*/`
            <div class="login">
                <div class="header">
                    <h1>Log in<hr></h1>
                </div>
                <form class="form" onsubmit=handleLogin(event)>
                    <div class="inputs">
                        <div class="input-container">
                            <input type="email" id="email" placeholder="Email" />
                            <span>
                                ${returnIcon('mail-outline')}
                            </span>
                        </div>
                        <div class="input-container">
                            <input type="password" id="password" placeholder="Password" />
                            <span>
                                ${returnIcon('lock')}
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
    `
}

function renderRegister() {
    const formRef = document.querySelector('.form-container');
    const btnContainerRef = document.querySelectorAll('.btn-container');
    btnContainerRef.forEach(btn => btn.style.display = 'none');

    formRef.innerHTML = /*html*/`
            <div class="register">
                <div class="header">
                    <h1>Sign up<hr></h1>
                    <button onclick="renderLogin(true)">${returnIcon('arrow-left')}</button>
                </div>
                <form class="form" onsubmit=handleRegister(event)>
                    <div class="inputs">
                        <div class="input-container">
                            <input type="text" id="name" placeholder="Name" />
                            <span>
                                ${returnIcon('user-outline')}
                            </span>
                        </div>
                        <div class="input-container">
                            <input type="email" id="email" placeholder="Email" />
                            <span>
                                ${returnIcon('mail-outline')}
                            </span>
                        </div>
                        <div class="input-container">
                            <input type="password" id="password" placeholder="Password" />
                            <span>
                                ${returnIcon('lock')}
                            </span>
                        </div>
                        <div class="input-container">
                            <input type="password" id="confirm-password" placeholder="Confirm Password" />
                            <span>
                                ${returnIcon('lock')}
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
    `
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user = await signIn(email, password);

    if (user) window.location.href = '/summary.html';
    else {
        const formRef = document.querySelector('.form');
        formRef.classList.add('error');
    }
}

async function anonymouslyLogin() {
    try {
        const user = await signInAnonymouslyUser();
        if (user) window.location.href = '/summary.html';
    } catch (error) {
        throw (error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const getField = (id) => document.getElementById(id).value;
    const name = getField('name'), email = getField('email');
    const password = getField('password'), confirmPassword = getField('confirm-password');
    const checkPrivacy = document.getElementById('check-privacy').checked;
    const errorRef = document.querySelector('.form .error-message');
    errorRef.innerText = '';

    const { errorMessages, returnState } = validateRegister(name, email, password, confirmPassword, checkPrivacy);

    if (!returnState) {
        errorRef.innerHTML = errorMessages;
        document.querySelector('.form').classList.add('error');
        return;
    }

    try {
        const user = await signUp(name, email, password);
        if (user) renderLogin(), showToast('You Signed Up successfully');
    } catch (error) {
        throw error;
    }
}

function validateRegister(name, email, password, confirmPassword, checkPrivacy) {
    let errorMessages = '', returnState = true;
    if (![name, email, password, confirmPassword].every(Boolean)) {
        errorMessages += 'Fill all fields.<br>'; returnState = false;
    }
    if (!checkPrivacy) {
        errorMessages += 'Accept the privacy policy.<br>'; returnState = false;
    }
    if (email && !/@/.test(email)) {
        errorMessages += 'Enter a valid email.<br>'; returnState = false;
    }
    if (password.length < 6) {
        errorMessages += 'Password must be at least 6 characters.<br>'; returnState = false;
    }
    if (password !== confirmPassword) {
        errorMessages += 'Passwords do not match.<br>'; returnState = false;
    }

    return { errorMessages, returnState };
}
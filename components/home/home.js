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
                <div class="sublinks">
                <a href="#">Privacy Policy</a>
                <a href="#">Legal notice</a>
            </div>
            </div>
        </div>
    `
    renderLogin();
});

function returnHeader() {
    return /*html*/`
        <div class="head">
            <div class="logo">
                ${returnIcon('logo-dark')}
            </div>
            <div class="btn-container">
                <span>Not a Join user?</span>
                <button onclick="renderRegister()">Sign up</button>
            </div>
        </div>
    `;
}

function renderLogin() {
    const formRef = document.querySelector('.form-container');
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
    formRef.innerHTML = /*html*/`
            <div class="register">
                <div class="header">
                    <h1>Sign up<hr></h1>
                    <button onclick="renderLogin()">${returnIcon('arrow-left')}</button>
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
        const formRef = document.querySelector('.login-form');
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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const checkPrivacy = document.getElementById('check-privacy').checked;
    const errorRef = document.querySelector('.form .error-message');
    errorRef.innerText = '';

    if (password !== confirmPassword) {
        const formRef = document.querySelector('.form');
        errorRef.innerText += 'Passwords do not match. Please try again.';
        formRef.classList.add('error');
    }
    if (!checkPrivacy) {
        const formRef = document.querySelector('.form');
        formRef.innerText += 'Please accept the privacy policy.';
        formRef.classList.add('error');
    }
    try {
        const user = await signUp(name, email, password);
        if (user) {
            renderLogin();
            showToast('You Signed Up successfully');
        }
    } catch (error) {
        throw (error);
    }
}
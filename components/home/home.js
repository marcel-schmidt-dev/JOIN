import returnIcon from '../icons.js';
import { signIn, signInAnonymouslyUser } from '../firebase.js';
window.anonymouslyLogin = anonymouslyLogin;

document.addEventListener('DOMContentLoaded', function () {
    const contentRef = document.querySelector('.content');
    contentRef.innerHTML = /*html*/`
        <div class="home">
            ${returnHeader()}
            <div class="login-container">
                <div class="form-container"></div>
                <div class="sublinks">
                <a href="#">Privacy Policy</a>
                <a href="#">Legal notice</a>
            </div>
            </div>
        </div>
    `
    returnLogin();
    addLoginListener();
});

function returnHeader() {
    return /*html*/`
        <div class="head">
            <div class="logo">
                ${returnIcon('logo-dark')}
            </div>
            <div class="btn-container">
                <span>Not a Join user?</span>
                <button>Sign up</button>
            </div>
        </div>
    `;
}

function returnLogin() {
    const formRef = document.querySelector('.form-container');
    formRef.innerHTML = /*html*/`
            <div class="login">
                <div class="login-header">
                    <h1>Log in<hr></h1>
                </div>
                <form class="login-form">
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

function addLoginListener() {
    document.querySelector('.login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = await signIn(email, password);
        if (user) window.location.href = '/summary.html';
        else {
            const formRef = document.querySelector('.login-form');
            formRef.classList.add('error');
        }
    });
}

async function anonymouslyLogin() {
    try {
        const user = await signInAnonymouslyUser();
        if (user) window.location.href = '/summary.html';
    } catch (error) {
        throw (error);
    }
}
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getDatabase, ref, get, push } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';
import returnRandomUserColor from './user-colors.js';

function getFirebaseDatabase() {
    const firebaseConfig = {
        apiKey: "AIzaSyBDHRtmOAgzYOtLRS0haC7KvV_AQO-HodA",
        authDomain: "join-d177e.firebaseapp.com",
        projectId: "join-d177e",
        storageBucket: "join-d177e.appspot.com",
        messagingSenderId: "224091284746",
        appId: "1:224091284746:web:22cd033dcc6f13c23146f3",
        databaseURL: "https://join-d177e-default-rtdb.europe-west1.firebasedatabase.app"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    return database;
}

export function getContacts() {
    const contactsRef = ref(getFirebaseDatabase(), 'contacts');

    get(contactsRef)
        .then((snapshot) => {
            return snapshot.val();
        });
}

export function addContact(fullName, email, phone) {
    const userObject = {
        fullName: fullName,
        email: email,
        phone: phone,
        userColor: returnRandomUserColor()
    }

    const contactsRef = ref(getFirebaseDatabase(), 'contacts');

    push(contactsRef, userObject)
}
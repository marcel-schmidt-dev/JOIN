import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get, push, remove, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { returnRandomUserColor } from "./utility-functions.js";

function getFirebaseDatabase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBDHRtmOAgzYOtLRS0haC7KvV_AQO-HodA",
    authDomain: "join-d177e.firebaseapp.com",
    projectId: "join-d177e",
    storageBucket: "join-d177e.appspot.com",
    messagingSenderId: "224091284746",
    appId: "1:224091284746:web:22cd033dcc6f13c23146f3",
    databaseURL: "https://join-d177e-default-rtdb.europe-west1.firebasedatabase.app",
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  return database;
}

export function getContacts() {
  const contactsRef = ref(getFirebaseDatabase(), "contacts");

  return get(contactsRef).then((snapshot) => {
    const contacts = [];
    const minLen = 20;
    if (snapshot.length < minLen) {
      for (let index = snapshot.length; index <= minLen; index++) {
        const contact = generateRandomContact();
        addContact(contact[0], contact[1], contact[2]);
      }
    }

    snapshot.forEach((childSnapshot) => {
      const contact = childSnapshot.val();
      contact.id = childSnapshot.key;
      contacts.push(contact);
    });

    return contacts;
  });
}

function generateRandomContact() {
  const names = [
    "Max Mustermann",
    "Erika Mustermann",
    "Hans Müller",
    "Petra Schmidt",
    "Klaus Schneider",
    "Monika Fischer",
    "Wolfgang Weber",
    "Sabine Meyer",
    "Jürgen Wagner",
    "Andrea Becker",
    "Thomas Schulz",
    "Birgit Hoffmann",
    "Michael Bauer",
    "Ursula Koch",
    "Stefan Richter",
    "Gabriele Klein",
    "Andreas Wolf",
    "Martina Schröder",
    "Peter Neumann",
    "Susanne Schwarz",
    "Frank Zimmermann",
    "Karin Braun",
    "Ralf Krüger",
    "Heike Hofmann",
    "Joachim Hartmann",
    "Anja Lange",
    "Bernd Schmitt",
    "Claudia Werner",
    "Holger Krause",
    "Ingrid Lehmann",
    "Matthias Schmid",
    "Renate Schubert",
    "Dieter Böhm",
    "Elke Frank",
    "Manfred Albrecht",
    "Silke Simon",
    "Günter Ludwig",
    "Angelika Busch",
    "Horst Peters",
    "Christa Fuchs"
  ];
  const emails = [
    "max.mustermann@example.com",
    "erika.mustermann@example.com",
    "hans.mueller@example.com",
    "petra.schmidt@example.com",
    "klaus.schneider@example.com",
    "monika.fischer@example.com",
    "wolfgang.weber@example.com",
    "sabine.meyer@example.com",
    "juergen.wagner@example.com",
    "andrea.becker@example.com",
    "thomas.schulz@example.com",
    "birgit.hoffmann@example.com",
    "michael.bauer@example.com",
    "ursula.koch@example.com",
    "stefan.richter@example.com",
    "gabriele.klein@example.com",
    "andreas.wolf@example.com",
    "martina.schroeder@example.com",
    "peter.neumann@example.com",
    "susanne.schwarz@example.com",
    "frank.zimmermann@example.com",
    "karin.braun@example.com",
    "ralf.krueger@example.com",
    "heike.hofmann@example.com",
    "joachim.hartmann@example.com",
    "anja.lange@example.com",
    "bernd.schmitt@example.com",
    "claudia.werner@example.com",
    "holger.krause@example.com",
    "ingrid.lehmann@example.com",
    "matthias.schmid@example.com",
    "renate.schubert@example.com",
    "dieter.boehm@example.com",
    "elke.frank@example.com",
    "manfred.albrecht@example.com",
    "silke.simon@example.com",
    "guenter.ludwig@example.com",
    "angelika.busch@example.com",
    "horst.peters@example.com",
    "christa.fuchs@example.com"
  ];

  const phones = [
    "+49 170 1234567",
    "+49 171 2345678",
    "+49 172 3456789",
    "+49 173 4567890",
    "+49 174 5678901",
    "+49 175 6789012",
    "+49 176 7890123",
    "+49 177 8901234",
    "+49 178 9012345",
    "+49 179 0123456",
    "+49 160 1234567",
    "+49 161 2345678",
    "+49 162 3456789",
    "+49 163 4567890",
    "+49 164 5678901",
    "+49 165 6789012",
    "+49 166 7890123",
    "+49 167 8901234",
    "+49 168 9012345",
    "+49 169 0123456",
    "+49 150 1234567",
    "+49 151 2345678",
    "+49 152 3456789",
    "+49 153 4567890",
    "+49 154 5678901",
    "+49 155 6789012",
    "+49 156 7890123",
    "+49 157 8901234",
    "+49 158 9012345",
    "+49 159 0123456",
    "+49 130 1234567",
    "+49 131 2345678",
    "+49 132 3456789",
    "+49 133 4567890",
    "+49 134 5678901",
    "+49 135 6789012",
    "+49 136 7890123",
    "+49 137 8901234",
    "+49 138 9012345",
    "+49 139 0123456"
  ];

  const random = Math.floor(Math.random() * names.length);

  return [names[random], emails[random], phones[random]];
}

export function addContact(fullName, email, phone) {
  const userObject = {
    fullName: fullName,
    email: email,
    phone: phone,
    userColor: returnRandomUserColor(),
  };

  const contactsRef = ref(getFirebaseDatabase(), "contacts");

  push(contactsRef, userObject);
}

export function deleteContact(id) {
  const contactsRef = ref(getFirebaseDatabase(), `contacts/${id}`);
  remove(contactsRef);
}

export function editContact(id, name, email, phone, userColor) {
  const db = getDatabase();
  set(ref(db, `contacts/${id}`), {
    fullName: name,
    email: email,
    phone: phone,
    userColor: userColor,
  });
}

export function getBoard(slot) {
  const db = getFirebaseDatabase();
  get(ref(db, "board/")).then((snapshot) => {
    const board = snapshot.val();
    console.log(board);
  });
}

export function addTask(slot, title, description, type, priority, dueDate, subTasks, assignee) {
  const db = getFirebaseDatabase();
  const taskRef = ref(db, `board/${slot}`);
  push(taskRef, {
    title: title,
    description: description,
    type: type,
    priority: priority,
    dueDate: dueDate,
    subTasks: returnSubtaskArray(subTasks),
    assignee: assignee,
  });
}

function returnSubtaskArray(subTasks) {
  let subTaskArray = [];

  subTasks.forEach((subTask) => {
    subTaskArray.push({
      title: subTask,
      checked: false,
    });
  });

  return subTaskArray;
}
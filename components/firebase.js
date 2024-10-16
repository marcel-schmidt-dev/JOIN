import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get, push, remove, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { returnRandomUserColor, returnRandomContact } from "./utility-functions.js";

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

//TODO: Refactor to Async/Await
export function getContacts() {
  const contactsRef = ref(getFirebaseDatabase(), "contacts");

  return get(contactsRef).then((snapshot) => {
    const contacts = [];
    const minLen = 20;
    if (snapshot.size < minLen) {
      for (let index = snapshot.size; index < minLen; index++) {
        const contact = returnRandomContact();
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

export async function returnBoard(slot) {
  const db = getFirebaseDatabase();

  try {
    const snapshot = await get(ref(db, "board/"));
    const board = snapshot.val();

    if (slot === undefined) {
      return board;
    }
    return board[slot];
  } catch (error) {
    console.error(error);
  }
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

export function deleteTask(slot, id) {
  const db = getFirebaseDatabase();
  const taskRef = ref(db, `board/${slot}/${id}`);
  remove(taskRef);
}

export function editTask(slot, id, title, description, type, priority, dueDate, subTasks, assignee) {
  const db = getFirebaseDatabase();
  const taskRef = ref(db, `board/${slot}/${id}`);
  set(taskRef, {
    title: title,
    description: description,
    type: type,
    priority: priority,
    dueDate: dueDate,
    subTasks: returnSubtaskArray(subTasks),
    assignee: assignee,
  });
}

export function moveTaskToSlot(oldSlot, newSlot, id) {
  const db = getFirebaseDatabase();
  const taskRef = ref(db, `board/${oldSlot}/${id}`);
  const newTaskRef = ref(db, `board/${newSlot}`);
  get(taskRef).then((snapshot) => {
    const task = snapshot.val();
    push(newTaskRef, task);
    remove(taskRef);
  });
}
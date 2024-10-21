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

export async function getContact(id) {
  const contactsRef = ref(getFirebaseDatabase(), `contacts/${id}`);
  const snapshot = await get(contactsRef);
  const contact = snapshot.val();

  contact.id = snapshot.key;
  return contact;
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
  //await createRandomTasks();
  const db = getFirebaseDatabase();

  try {
    const snapshot = await get(ref(db, "board/"));
    const board = snapshot.val();

    if (snapshot) {
      for (let slot in board) {
        board[slot] = Object.entries(board[slot]).map(([key, task]) => {
          task.id = key;
          return task;
        });
      }
    }

    if (slot === undefined) {
      return board;
    }
    return board[slot];
  } catch (error) {
    console.error(error);
  }
}

export async function returnTaskById(id) {
  const db = getFirebaseDatabase();
  const boardRef = ref(db, `board/`);

  const boardSnapshot = await get(boardRef);
  const board = boardSnapshot.val();

  for (const slot in board) {
    if (board[slot] && board[slot][id]) {
      return board[slot][id];
    }
  }

  return null;
}

export async function returnSubTasks(id, slot) {
  const db = getFirebaseDatabase();
  const taskRef = ref(db, `board/${slot}/${id}/subTasks`);
  const snapshot = await get(taskRef);
  const subTaskArray = [];

  snapshot.forEach((childSnapshot) => {
    const subTask = childSnapshot.val();
    subTask.id = childSnapshot.key;
    subTaskArray.push(subTask);
  });

  return subTaskArray;
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

export async function moveTaskToSlot(newSlot, id) {
  try {
    newSlot = newSlot.replace("-tasks", "");

    const db = getFirebaseDatabase();
    let taskRef = null;
    let taskData = null;
    let currentSlot = null;

    const boardRef = ref(db, "board/");
    const boardSnapshot = await get(boardRef);

    const board = boardSnapshot.val();

    for (const slot in board) {
      if (board[slot] && board[slot][id]) {
        currentSlot = slot;
        taskRef = ref(db, `board/${slot}/${id}`);
        const taskSnapshot = await get(taskRef);
        if (taskSnapshot.exists()) {
          taskData = taskSnapshot.val();
          break;
        }
      }
    }

    if (currentSlot === newSlot) {
      return;
    }

    const newTaskRef = ref(db, `board/${newSlot}/${id}`);
    await set(newTaskRef, taskData);

    await remove(taskRef);

  } catch (error) {
    console.error("Error moving Task to slot:", error);
    throw error;
  }
}

export async function updateSubTaskStatus(slot, taskId, subTaskId, isChecked) {
  const db = getFirebaseDatabase();
  const subTaskRef = ref(db, `board/${slot}/${taskId}/subTasks/${subTaskId}`);

  try {
    await set(subTaskRef, { checked: isChecked });
  } catch (error) {
    console.error("Error updating subtask status:", error);
    throw error;
  }
}

// Copyright by ChatGPT for creating dummy data in Database faster
async function createRandomTasks() {
  const db = getFirebaseDatabase();
  const contactsRef = ref(db, 'contacts/');

  const exampleTitles = [
    "Implement new feature",
    "Fix bug in application",
    "Write documentation",
    "Design UI for new project",
    "Conduct code review"
  ];

  const exampleDescriptions = [
    "This task involves implementing a new feature for the application.",
    "This task is about fixing a bug that has been reported.",
    "Document the code and create user manuals.",
    "Design the user interface for the new project based on the requirements.",
    "Review the code submitted by team members for quality assurance."
  ];

  const examplePriorities = ["low", "medium", "urgent"];
  const exampleDueDates = [
    "2024-11-01",
    "2024-11-15",
    "2024-11-30",
    "2024-12-15",
    "2025-01-01"
  ];

  try {
    const contactsSnapshot = await get(contactsRef);
    const contacts = contactsSnapshot.val();
    const contactKeys = Object.keys(contacts);

    for (let i = 0; i < 2; i++) {
      const randomTitle = exampleTitles[Math.floor(Math.random() * exampleTitles.length)];
      const randomDescription = exampleDescriptions[Math.floor(Math.random() * exampleDescriptions.length)];
      const randomPriority = examplePriorities[Math.floor(Math.random() * examplePriorities.length)];
      const randomDueDate = exampleDueDates[Math.floor(Math.random() * exampleDueDates.length)];

      const randomAssignees = [];
      for (let j = 0; j < 2; j++) {
        const randomIndex = Math.floor(Math.random() * contactKeys.length);
        randomAssignees.push(contactKeys[randomIndex]);
      }

      const newTask = {
        title: randomTitle,
        description: randomDescription,
        position: i + 1,
        type: "Technical Task",
        priority: randomPriority,
        dueDate: randomDueDate,
        subTasks: [
          { title: "Initial setup", checked: false },
          { title: "Create documentation", checked: false }
        ],
        assignee: randomAssignees
      };

      await push(ref(db, 'board/inProgress/'), newTask);
      await push(ref(db, 'board/done/'), newTask);
      await push(ref(db, 'board/awaitFeedback/'), newTask);
      await push(ref(db, 'board/todo/'), newTask);
    }

    console.log("random tasks created");
  } catch (error) {
    console.error("error creating tasks: ", error);
  }
}
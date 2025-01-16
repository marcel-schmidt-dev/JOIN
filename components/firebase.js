import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  push,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { returnRandomUserColor, returnRandomContact } from "./utility-functions.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

function getFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBDHRtmOAgzYOtLRS0haC7KvV_AQO-HodA",
    authDomain: "join-d177e.firebaseapp.com",
    databaseURL: "https://join-d177e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "join-d177e",
    storageBucket: "join-d177e.appspot.com",
    messagingSenderId: "224091284746",
    appId: "1:224091284746:web:22cd033dcc6f13c23146f3",
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

  return { database, auth };
}

//TODO: Refactor to Async/Await
export async function getContacts() {
  const { database } = getFirebase();
  const contactsRef = ref(database, "contacts");

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
  const { database } = getFirebase();
  const contactsRef = ref(database, `contacts/${id}`);
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

  const { database } = getFirebase();
  const contactsRef = ref(database, "contacts");

  push(contactsRef, userObject);
}

export async function deleteContact(id) {
  const { database } = getFirebase();
  const contactsRef = ref(database, `contacts/${id}`);
  const boardSnap = await get(ref(database, "board/"));

  boardSnap.forEach((slot) => {
    slot.forEach((task) => {
      const taskRef = task.val();
      if (taskRef.assignee.includes(id)) {
        taskRef.assignee = taskRef.assignee.filter((assignee) => assignee !== id);
        set(ref(database, `board/${slot.key}/${task.key}`), taskRef);
      }
    });
  });
  remove(contactsRef);
}

export function editContact(id, name, email, phone, userColor) {
  const { database } = getDatabase();
  set(ref(database, `contacts/${id}`), {
    fullName: name,
    email: email,
    phone: phone,
    userColor: userColor,
  });
}

export async function returnBoard(slot) {
  //await createRandomTasks();
  const { database } = getFirebase();

  try {
    const snapshot = await get(ref(database, "board/"));
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
  const { database } = getFirebase();
  const boardRef = ref(database, `board/`);

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
  const { database } = getFirebase();
  const taskRef = ref(database, `board/${slot}/${id}/subTasks`);
  const snapshot = await get(taskRef);
  const subTaskArray = [];

  snapshot.forEach((childSnapshot) => {
    const subTask = childSnapshot.val();
    subTask.id = childSnapshot.key;
    subTaskArray.push(subTask);
  });

  return subTaskArray;
}

export function addTask(
  slot = "todo",
  title,
  description,
  type,
  priority,
  dueDate,
  subTasks,
  assignee
) {
  const { database } = getFirebase();
  const taskRef = ref(database, `board/${slot}`);

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
  const { database } = getFirebase();
  const taskRef = ref(database, `board/${slot}/${id}`);
  remove(taskRef);
}

export function editTask(
  slot,
  id,
  title,
  description,
  type,
  priority,
  dueDate,
  subTasks,
  assignee
) {
  const { database } = getFirebase();
  const taskRef = ref(database, `board/${slot}/${id}`);
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

    const { database } = getFirebase();
    let taskRef = null;
    let taskData = null;
    let currentSlot = null;

    const boardRef = ref(database, "board/");

    const boardSnapshot = await get(boardRef);
    const board = boardSnapshot.val();

    for (const slot in board) {
      if (board[slot] && board[slot][id]) {
        currentSlot = slot;
        taskRef = ref(database, `board/${slot}/${id}`);
        const taskSnapshot = await get(taskRef);

        if (taskSnapshot.exists()) {
          taskData = taskSnapshot.val();
          break;
        }
      }
    }

    if (!taskData) {
      console.error(`Task with ID ${id} not found in current slots.`);
      return;
    }

    if (currentSlot === newSlot) {
      console.log(`Task ${id} is already in the ${newSlot} slot.`);
      return;
    }

    const newTaskRef = ref(database, `board/${newSlot}/${id}`);
    if (!newTaskRef) {
      console.error(`New slot ${newSlot} does not exist.`);
      return;
    }

    await set(newTaskRef, taskData);

    await remove(taskRef);
    console.log(`Task ${id} moved to slot ${newSlot}`);
  } catch (error) {
    console.error("Error moving Task to slot:", error);
    throw error;
  }
}

export async function updateSubTaskStatus(slot, taskId, subTaskId, isChecked, title) {
  const { database } = getFirebase();
  const subTaskRef = ref(database, `board/${slot}/${taskId}/subTasks/${subTaskId}`);

  try {
    await set(subTaskRef, { checked: isChecked, title: title });
  } catch (error) {
    console.error("Error updating subtask status:", error);
    throw error;
  }
}

// Copyright by ChatGPT for creating dummy data in Database faster
async function createRandomTasks() {
  const { database } = getFirebase();
  const contactsRef = ref(database, "contacts/");

  const exampleTitles = [
    "Implement new feature",
    "Fix bug in application",
    "Write documentation",
    "Design UI for new project",
    "Conduct code review",
  ];
  const exampleDescriptions = [
    "This task involves implementing a new feature for the application.",
    "This task is about fixing a bug that has been reported.",
    "Document the code and create user manuals.",
    "Design the user interface for the new project based on the requirements.",
    "Review the code submitted by team members for quality assurance.",
  ];
  const examplePriorities = ["low", "medium", "urgent"];
  const exampleDueDates = ["2024-11-01", "2024-11-15", "2024-11-30", "2024-12-15", "2025-01-01"];
  const exampleTypes = ["Technical Task", "User Story"];

  try {
    const contactsSnapshot = await get(contactsRef);
    const contacts = contactsSnapshot.val();
    const contactKeys = Object.keys(contacts);

    const boardSlots = ["inProgress", "done", "awaitFeedback", "todo"];

    for (const slot of boardSlots) {
      for (let i = 0; i < 2; i++) {
        const randomTitle = exampleTitles[Math.floor(Math.random() * exampleTitles.length)];
        const randomDescription =
          exampleDescriptions[Math.floor(Math.random() * exampleDescriptions.length)];
        const randomPriority =
          examplePriorities[Math.floor(Math.random() * examplePriorities.length)];
        const randomDueDate = exampleDueDates[Math.floor(Math.random() * exampleDueDates.length)];
        const randomType = exampleTypes[Math.floor(Math.random() * exampleTypes.length)];

        const randomAssignees = [];
        for (let j = 0; j < 2; j++) {
          const randomIndex = Math.floor(Math.random() * contactKeys.length);
          randomAssignees.push(contactKeys[randomIndex]);
        }

        const newTask = {
          title: randomTitle,
          description: randomDescription,
          position: i + 1,
          type: randomType,
          priority: randomPriority,
          dueDate: randomDueDate,
          subTasks: [
            { title: "Initial setup", checked: false },
            { title: "Create documentation", checked: false },
          ],
          assignee: randomAssignees,
        };

        await push(ref(database, `board/${slot}/`), newTask);
      }
    }

    console.log("Random tasks created in each slot");
  } catch (error) {
    console.error("Error creating tasks: ", error);
  }
}

// TODO: FIX AUTHENTICATION

export async function getAuthUser() {
  const { auth } = getFirebase();
  const user = await new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
  return user;
}

export async function checkAuth() {
  const user = await getAuthUser();
  if (!user) {
    window.location.href = "/index.html";
  }
}

export async function signIn(email, password) {
  const { auth } = getFirebase();

  if (!email || !password) return false;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);

    return userCredential.user;
  } catch (error) {
    return false;
  }
}

export async function signOutUser() {
  const { auth } = getFirebase();
  try {
    await signOut(auth);
    window.location.href = "/";
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export async function signInAnonymouslyUser() {
  const { auth } = getFirebase();
  try {
    const userCredential = await signInAnonymously(auth);
    userCredential.user.displayName = "Guest";

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function signUp(fullName, email, password) {
  const { auth } = getFirebase();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: fullName,
    });
    return user;
  } catch (error) {
    throw error;
  }
}

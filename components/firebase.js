import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get, push, remove, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
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

/**
 * Initializes and returns the Firebase app, database, and authentication instance.
 * @returns {Object} An object containing the Firebase database and authentication instances.
 */
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

/**
 * Retrieves all contacts from the Firebase database.
 * If there are fewer than 20 contacts, it generates and adds dummy contacts.
 * @returns {Promise<Array>} A promise that resolves to an array of contacts.
 */
/**
 * Retrieves the contact list from the Firebase database.
 * If there are fewer than 20 contacts, it fills the list with random contacts.
 * @returns {Promise<Array>} A promise that resolves to an array of contacts.
 */
export async function getContacts() {
  const contacts = await fetchContacts();
  return contacts.length < 20 ? fillContacts(contacts) : contacts;
}

/**
 * Fetches contacts from the Firebase database.
 * @returns {Promise<Array>} A promise that resolves to an array of contacts.
 */
async function fetchContacts() {
  const { database } = getFirebase();
  const snapshot = await get(ref(database, "contacts"));
  return snapshot.exists() ? snapshotToArray(snapshot) : [];
}

/**
 * Converts a Firebase snapshot into an array of contact objects.
 * @param {Object} snapshot - The Firebase snapshot containing contact data.
 * @returns {Array} An array of contact objects.
 */
function snapshotToArray(snapshot) {
  const contacts = [];
  snapshot.forEach((childSnapshot) => {
    contacts.push({ id: childSnapshot.key, ...childSnapshot.val() });
  });
  return contacts;
}

/**
 * Fills the contact list with randomly generated contacts until it reaches 20 entries.
 * @param {Array} contacts - The current list of contacts.
 * @returns {Array} The updated list of contacts.
 */
function fillContacts(contacts) {
  while (contacts.length < 20) {
    const contact = returnRandomContact();
    addContact(contact[0], contact[1], contact[2]);
  }
  return contacts;
}

/**
 * Retrieves a single contact by its ID from the Firebase database.
 * @param {string} id - The ID of the contact to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the contact object.
 */
export async function getContact(id) {
  const { database } = getFirebase();
  const contactsRef = ref(database, `contacts/${id}`);
  const snapshot = await get(contactsRef);
  const contact = snapshot.val();
  contact.id = snapshot.key;
  return contact;
}

/**
 * Adds a new contact to the Firebase database.
 * @param {string} fullName - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
export function addContact(fullName, email, phone) {
  const userObject = {
    fullName: fullName,
    email: email,
    phone: phone,
    userColor: returnRandomUserColor(),
  };

  const { database } = getFirebase();
  const contactsRef = ref(database, "contacts");

  const newContactRef = push(contactsRef, userObject);
  return newContactRef.key;
}

/**
 * Deletes a contact from the Firebase database and removes the contact from any tasks they are assigned to.
 * @param {string} id - The ID of the contact to delete.
 */
export async function deleteContact(id) {
  const { database } = getFirebase();
  const contactsRef = ref(database, `contacts/${id}`);
  const boardSnap = await get(ref(database, "board/"));
  boardSnap.forEach((slot) => {
    slot.forEach((task) => {
      const taskRef = task.val();
      if (Array.isArray(taskRef.assignee) && taskRef.assignee.includes(id)) {
        taskRef.assignee = taskRef.assignee.filter((assignee) => assignee !== id);
        set(ref(database, `board/${slot.key}/${task.key}`), taskRef);
      }
    });
  });
  remove(contactsRef);
}

/**
 * Edits the details of an existing contact in the Firebase database.
 * @param {string} id - The ID of the contact to edit.
 * @param {string} name - The updated full name of the contact.
 * @param {string} email - The updated email of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @param {string} userColor - The updated user color for the contact.
 */
export function editContact(id, name, email, phone, userColor) {
  const database = getDatabase();
  return set(ref(database, `contacts/${id}`), {
    fullName: name,
    email: email,
    phone: phone,
    userColor: userColor,
  }).catch((error) => {
    console.error("Error updating contact:", error);
  });
}

/**
 * Fetches the board data from the Firebase database.
 *
 * @returns {Promise<Object>} The board object from the database.
 */
async function fetchBoardData() {
  const { database } = getFirebase();
  const snapshot = await get(ref(database, "board/"));
  return snapshot.val();
}

/**
 * Processes the board data by adding an ID to each task.
 *
 * @param {Object} board - The board object to be processed.
 * @returns {Object} The processed board object with tasks that have an ID.
 */
function processBoardData(board) {
  for (let slot in board) {
    board[slot] = Object.entries(board[slot]).map(([key, task]) => {
      task.id = key;
      return task;
    });
  }
  return board;
}

/**
 * Returns the entire board or a specific slot from the board.
 *
 * @param {string} [slot] - The specific slot to fetch from the board.
 * @returns {Promise<Object>} The board or the specific slot data.
 */
export async function returnBoard(slot) {
  try {
    const board = await fetchBoardData();
    if (board) {
      const processedBoard = processBoardData(board);
      return slot === undefined ? processedBoard : processedBoard[slot];
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves a specific task by its ID from the Firebase database.
 * @param {string} id - The ID of the task to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the task object or null if not found.
 */
export async function returnTaskById(id) {
  const { database } = getFirebase();
  const boardRef = ref(database, `board/`);
  const boardSnapshot = await get(boardRef);
  const board = boardSnapshot.val();
  for (const slot in board) {
    if (board[slot] && board[slot][id]) {
      let task = board[slot][id];
      task.id = id;
      return board[slot][id];
    }
  }
  return null;
}

/**
 * Retrieves the sub-tasks of a task from the Firebase database.
 * @param {string} id - The ID of the task to retrieve sub-tasks for.
 * @param {string} slot - The slot in the task board (e.g., "todo").
 * @returns {Promise<Array>} A promise that resolves to an array of sub-task objects.
 */
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

/**
 * Adds a new task to the board in the specified slot.
 * @param {string} slot - The slot to add the task to (e.g., "todo").
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} type - The type of the task (e.g., "Technical Task").
 * @param {string} priority - The priority of the task (e.g., "urgent").
 * @param {string} dueDate - The due date of the task.
 * @param {Array<string>} subTasks - An array of sub-task titles.
 * @param {Array<string>} assignee - An array of user IDs assigned to the task.
 */
export function addTask(slot = "todo", title, description, type, priority, dueDate, subTasks, assignee) {
  const { database } = getFirebase();
  const taskRef = ref(database, `board/${slot}`);

  push(taskRef, {
    title: title,
    description: description,
    type: type,
    priority: priority,
    dueDate: dueDate,
    subTasks: subTasks,
    assignee: assignee,
  });
}

/**
 * Deletes a task from the specified slot on the board.
 * @param {string} slot - The slot the task is in (e.g., "todo").
 * @param {string} id - The ID of the task to delete.
 */
export function deleteTask(slot, id) {
  const { database } = getFirebase();
  const taskRef = ref(database, `board/${slot}/${id}`);
  remove(taskRef);
}

/**
 * Edits an existing task on the board.
 * @param {string} slot - The slot the task is in (e.g., "todo").
 * @param {string} id - The ID of the task to edit.
 * @param {string} title - The updated title of the task.
 * @param {string} description - The updated description of the task.
 * @param {string} type - The updated type of the task (e.g., "Technical Task").
 * @param {string} priority - The updated priority of the task.
 * @param {string} dueDate - The updated due date of the task.
 * @param {Array<string>} subTasks - The updated sub-tasks of the task.
 * @param {Array<string>} assignee - The updated assignees for the task.
 */
export function editTask(slot, id, title, description, type, priority, dueDate, subTasks, assignee) {
  const { database } = getFirebase();
  const taskRef = ref(database, `board/${slot}/${id}`);
  set(taskRef, {
    title: title,
    description: description,
    type: type,
    priority: priority,
    dueDate: dueDate,
    subTasks: subTasks,
    assignee: assignee,
  });
}

/**
 * Moves a task to a different slot in the board.
 *
 * @param {string} newSlot The new slot where the task should be moved.
 * @param {string} id The ID of the task to be moved.
 * @throws {Error} If there is an error moving the task or the task is not found.
 */
export async function moveTaskToSlot(newSlot, id) {
  try {
    const cleanSlot = sanitizeSlotName(newSlot);
    const { database } = getFirebase();
    const board = await fetchBoard(database);

    const { taskRef, taskData, currentSlot } = await findTask(board, id, database);
    if (!taskData || currentSlot === cleanSlot) return;

    await transferTask(database, cleanSlot, id, taskRef, taskData);
  } catch (error) {
    throw error;
  }
}

function sanitizeSlotName(slot) {
  return slot.replace("-tasks", "");
}

async function fetchBoard(database) {
  const boardRef = ref(database, "board/");
  const boardSnapshot = await get(boardRef);
  return boardSnapshot.val();
}

async function findTask(board, id, database) {
  for (const slot in board) {
    if (board[slot]?.[id]) {
      const taskRef = ref(database, `board/${slot}/${id}`);
      const taskSnapshot = await get(taskRef);
      if (taskSnapshot.exists()) {
        return { taskRef, taskData: taskSnapshot.val(), currentSlot: slot };
      }
    }
  }
  return { taskRef: null, taskData: null, currentSlot: null };
}

async function transferTask(database, newSlot, id, oldTaskRef, taskData) {
  const newTaskRef = ref(database, `board/${newSlot}/${id}`);
  await set(newTaskRef, taskData);
  await remove(oldTaskRef);
}

/**
 * Updates the status of a subtask.
 *
 * @param {string} slot The slot of the task where the subtask belongs.
 * @param {string} taskId The ID of the task to which the subtask belongs.
 * @param {string} subTaskId The ID of the subtask to update.
 * @param {boolean} isChecked The new status of the subtask (checked or not).
 * @param {string} title The title of the subtask.
 * @throws {Error} If there is an error updating the subtask status.
 */
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

/**
 * Retrieves the current authenticated user.
 *
 * @returns {Promise<Object|null>} The current authenticated user or null if no user is authenticated.
 */
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

/**
 * Checks if a user is authenticated, and redirects to login if not.
 *
 * @throws {Error} If the user is not authenticated.
 */
export async function checkAuth() {
  const user = await getAuthUser();
  if (!user) {
    window.location.href = "/index.html";
  }
}

/**
 * Signs in a user with the provided email and password.
 *
 * @param {string} email The user's email address.
 * @param {string} password The user's password.
 * @returns {Promise<Object|false>} The authenticated user object or false if authentication failed.
 */
export async function signIn(email, password) {
  const { auth } = getFirebase();

  if (!email || !password) return false;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    return false;
  }
}

/**
 * Signs out the current authenticated user.
 *
 * @throws {Error} If there is an error signing out.
 */
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

/**
 * Signs in a user anonymously.
 *
 * @returns {Promise<Object>} The anonymously signed-in user object.
 * @throws {Error} If there is an error signing in anonymously.
 */
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

/**
 * Signs up a new user with the provided full name, email, and password.
 *
 * @param {string} fullName The user's full name.
 * @param {string} email The user's email address.
 * @param {string} password The user's password.
 * @returns {Promise<Object>} The signed-up user object.
 * @throws {Error} If there is an error during the sign-up process.
 */
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

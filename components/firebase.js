import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getDatabase, ref, get, push, remove, set } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';
import { returnRandomUserColor, returnRandomContact } from './utility-functions.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously, createUserWithEmailAndPassword, updateProfile, signOut } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

/**
 * Initializes and returns the Firebase app, database, and authentication instance.
 * @returns {Object} An object containing the Firebase database and authentication instances.
 */
function getFirebase() {
  const firebaseConfig = {
    apiKey: 'AIzaSyBDHRtmOAgzYOtLRS0haC7KvV_AQO-HodA',
    authDomain: 'join-d177e.firebaseapp.com',
    databaseURL: 'https://join-d177e-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'join-d177e',
    storageBucket: 'join-d177e.appspot.com',
    messagingSenderId: '224091284746',
    appId: '1:224091284746:web:22cd033dcc6f13c23146f3',
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
export async function getContacts() {
  const { database } = getFirebase();
  const contactsRef = ref(database, 'contacts');

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
  const contactsRef = ref(database, 'contacts');

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
  const boardSnap = await get(ref(database, 'board/'));

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
    console.error('Error updating contact:', error);
  });
}

/**
 * Retrieves the entire task board or a specific slot of tasks.
 * @param {string} [slot] - The specific slot to retrieve (e.g., "todo", "done").
 * @returns {Promise<Object>} A promise that resolves to an object representing the board or a specific slot.
 */
export async function returnBoard(slot) {
  const { database } = getFirebase();

  try {
    const snapshot = await get(ref(database, 'board/'));
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
export function addTask(slot = 'todo', title, description, type, priority, dueDate, subTasks, assignee) {
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
    newSlot = newSlot.replace('-tasks', '');

    const { database } = getFirebase();
    let taskRef = null;
    let taskData = null;
    let currentSlot = null;

    const boardRef = ref(database, 'board/');

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
      return;
    }

    if (currentSlot === newSlot) {
      return;
    }

    const newTaskRef = ref(database, `board/${newSlot}/${id}`);
    if (!newTaskRef) {
      return;
    }

    await set(newTaskRef, taskData);
    await remove(taskRef);
  } catch (error) {
    throw error;
  }
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
    console.error('Error updating subtask status:', error);
    throw error;
  }
}

/**
 * Creates random tasks and assigns them to the board slots.
 *
 * @async
 * @throws {Error} If there is an error creating the tasks.
 */
async function createRandomTasks() {
  const { database } = getFirebase();
  const contactsRef = ref(database, 'contacts/');

  const exampleTitles = ['Implement new feature', 'Fix bug in application', 'Write documentation', 'Design UI for new project', 'Conduct code review'];
  const exampleDescriptions = [
    'This task involves implementing a new feature for the application.',
    'This task is about fixing a bug that has been reported.',
    'Document the code and create user manuals.',
    'Design the user interface for the new project based on the requirements.',
    'Review the code submitted by team members for quality assurance.',
  ];
  const examplePriorities = ['low', 'medium', 'urgent'];
  const exampleDueDates = ['2024-11-01', '2024-11-15', '2024-11-30', '2024-12-15', '2025-01-01'];
  const exampleTypes = ['Technical Task', 'User Story'];

  try {
    const contactsSnapshot = await get(contactsRef);
    const contacts = contactsSnapshot.val();
    const contactKeys = Object.keys(contacts);

    const boardSlots = ['inProgress', 'done', 'awaitFeedback', 'todo'];

    for (const slot of boardSlots) {
      for (let i = 0; i < 2; i++) {
        const randomTitle = exampleTitles[Math.floor(Math.random() * exampleTitles.length)];
        const randomDescription = exampleDescriptions[Math.floor(Math.random() * exampleDescriptions.length)];
        const randomPriority = examplePriorities[Math.floor(Math.random() * examplePriorities.length)];
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
            { title: 'Initial setup', checked: false },
            { title: 'Create documentation', checked: false },
          ],
          assignee: randomAssignees,
        };

        await push(ref(database, `board/${slot}/`), newTask);
      }
    }

    console.log('Random tasks created in each slot');
  } catch (error) {
    console.error('Error creating tasks: ', error);
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
    window.location.href = '/index.html';
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
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
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
    userCredential.user.displayName = 'Guest';

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

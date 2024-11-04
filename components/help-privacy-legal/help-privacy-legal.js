import returnIcon from "../icons.js";
import { getAuthUser } from "../firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    window.handleBack = handleBack;

    let contentRef;
    while ((contentRef = document.querySelector(".content")) === null) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const urlPath = window.location.pathname;

    const user = await getAuthUser();

    function handleBack() {
        if (user) {
            window.location.href = "/board.html";
        }
        else {
            window.location.href = "/";
        }
    }


    if (urlPath === '/help.html') {
        contentRef.innerHTML = /*html*/`
            <div class="help-privacy-legal">
                <div class="heading"><h1>Help</h1><button onclick="handleBack()">${returnIcon('arrow-left')}</button></div>
                <div class="inner-content">
                    <p>Welcome to the help page for <span>Join</span>, your guide to using our kanban project management tool. Here, we'll provide an overview of what <span>Join</span> is, how it can benefit you, and how to use it.</p>
                    <h2>What is Join?</h2>
                    <p><span>Join</span> is a kanban-based project management tool designed and built by a group of dedicated students as part of their web development bootcamp at the Developer Akademie.</p>
                    <p>Kanban, a Japanese term meaning "billboard", is a highly effective method to visualize work, limit work-in-progress, and maximize efficiency (or flow). <span>Join</span> leverages the principles of kanban to help users manage their tasks and projects in an intuitive, visual interface.</p>
                    <p>It is important to note that <span>Join</span> is designed as an educational exercise and is not intended for extensive business usage. While we strive to ensure the best possible user experience, we cannot guarantee consistent availability, reliability, accuracy, or other aspects of quality regarding Join.</p>
                    <h2>How to use it</h2>
                    <p>Here is a step-by-step guide on how to use <span>Join</span>:</p>
                    <ol>
                        <li>
                            <h3>Exploring the Board</h3>
                            <p>When you log in to <span>Join</span>, you'll find a default board. This board represents your project and contains four default lists: "To Do", "In Progress", “Await feedback” and "Done".</p>
                        </li>
                        <li>
                            <h3>Creating Contacts</h3>
                            <p>In <span>Join</span>, you can add contacts to collaborate on your projects. Go to the "Contacts" section, click on "New contact", and fill in the required information. Once added, these contacts can be assigned tasks and they can interact with the tasks on the board.</p>
                        </li>
                        <li>
                            <h3>Adding Cards</h3>
                            <p>Now that you've added your contacts, you can start adding cards. Cards represent individual tasks. Click the "+" button under the appropriate list to create a new card. Fill in the task details in the card, like task name, description, due date, assignees, etc.</p>
                        </li>
                        <li>
                            <h3>Moving Cards</h3>
                            <p>As the task moves from one stage to another, you can reflect that on the board by dragging and dropping the card from one list to another.</p>
                        </li>
                        <li>
                            <h3>Deleting Cards</h3>
                            <p>Once a task is completed, you can either move it to the "Done" list or delete it. Deleting a card will permanently remove it from the board. Please exercise caution when deleting cards, as this action is irreversible.</p>
                            <p>Remember that using <span>Join</span> effectively requires consistent updates from you and your team to ensure the board reflects the current state of your project.</p>
                            <p>Have more questions about <span>Join</span>? Feel free to contact us at [Your Contact Email]. We're here to help you!</p>
                        </li>
                    </ol>
                    <h2>Enjoy using Join!</h2>
                </div>
            </div>
        `
    }
});
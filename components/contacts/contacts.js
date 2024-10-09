import returnContactList from "./contact-list/contact-list.js";
import getContactInfosTemplate from "./contact-details/contact-details.js";

document.addEventListener("DOMContentLoaded", async function () {
  const contentRef = document.querySelector(".content");

  contentRef.innerHTML += await returnContactList();
  contentRef.innerHTML += getContactInfosTemplate({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-202-555-0175",
    userColor: "#4a5a7f",
  });
});

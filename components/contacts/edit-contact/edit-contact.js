import returnIcon from "../../icons.js";

export default function getEditContactTemplate(contactInfos) {
  return /*html*/ `
        <div class="edit-contact">
      <div class="overlay-add-contact">
        <div class="add-contact">
          <div class="description">
            <div class="join-container">
              ${returnIcon("logo-light")}
            </div>
            <div class="description-box">
              <h1>Edit contact</h1>
              <div class="separator"></div>
            </div>
          </div>
        </div>
        <div class="person-container">
          <div class="person-icon">
            <svg class="person-svg" width="71" height="35" viewBox="0 0 71 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.09771 34.7144H0.62328L12.9241 0.532536H18.8825L31.1833 34.7144H25.7089L16.0452 6.74134H15.7781L6.09771 34.7144ZM7.01568 21.3287H24.7742V25.6682H7.01568V21.3287ZM36.1195 0.532536H42.3783L53.2604 27.1036H53.661L64.5431 0.532536H70.802V34.7144H65.895V9.97927H65.5779L55.4969 34.6643H51.4245L41.3435 9.96258H41.0264V34.7144H36.1195V0.532536Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div class="input-container">
          <div class="x-container">
            ${returnIcon("x")}
          </div>
          <form class="form" action="">
            <div class="form-name">
              <input class="name-input" id="name" required type="text" name="Name" placeholder="Name" ${contactInfos.fullName} />
              ${returnIcon("user-outline")}
            </div>
            <div class="form-email">
              <input class="name-input" id="email" required type="text" name="Email" placeholder="Email" ${contactInfos.email} />
              ${returnIcon("mail-outline")}
            </div>
            <div class="form-number">
              <input class="name-input" id="number" required type="number" name="Phone" placeholder="Phone" ${contactInfos.phone} />
              ${returnIcon("tel-outline")}
            </div>
          </form>
          <div class="button-container">
            <div class="button-cancel-container">
              <button class="button-delete">
                Delete
                ${returnIcon("trash-outline")}
              </button>
            </div>
            <div class="button-save-container">
              <button class="button-save">
                Save
                ${returnIcon("check")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}

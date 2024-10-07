import returnIcon from "../icons.js"

export default function returnHeader() {
    return /*html*/`
        <header>
            <span>Kanban Projekt Management Tool</span>
            <div>
                <a href="./help.html">${returnIcon('help')}</a>
                <button>G</button>
            </div>
        </header>
    `
}
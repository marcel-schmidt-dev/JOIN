import returnIcon from "./icons.js"

export default function returnHeader() {
    return /*html*/`
        <header>
            <span>Kanban Projekt Management Tool</span>
            <div>
                ${returnIcon('help')}
                <button>JN</button>
            </div>
        </header>
    `
}
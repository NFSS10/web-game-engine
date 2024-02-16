import html from "./template.html";
import style from "./style.css";

class DebuggerWindowElement extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });
        const template = document.createElement("template");
        template.innerHTML = html + `<style>${style}</style>`;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

export { DebuggerWindowElement };

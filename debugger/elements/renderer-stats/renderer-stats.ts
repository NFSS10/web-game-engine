import { type RendererInfo } from "@debugger/types";
import html from "./template.html";
import style from "./style.css";

class DebuggerRendererStatsElement extends HTMLElement {
    #fpsValueElem: HTMLElement;
    #texturesValueElem: HTMLElement;
    #geometriesValueElem: HTMLElement;
    #pointsValueElem: HTMLElement;
    #trianglesValueElem: HTMLElement;
    #linesValueElem: HTMLElement;
    #callsValueElem: HTMLElement;

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });
        const template = document.createElement("template");
        template.innerHTML = html + `<style>${style}</style>`;
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.#fpsValueElem = shadowRoot.querySelector(".fps > .value") as HTMLElement;
        this.#texturesValueElem = shadowRoot.querySelector(".textures > .value") as HTMLElement;
        this.#geometriesValueElem = shadowRoot.querySelector(".geometries > .value") as HTMLElement;
        this.#pointsValueElem = shadowRoot.querySelector(".points > .value") as HTMLElement;
        this.#trianglesValueElem = shadowRoot.querySelector(".triangles > .value") as HTMLElement;
        this.#linesValueElem = shadowRoot.querySelector(".lines > .value") as HTMLElement;
        this.#callsValueElem = shadowRoot.querySelector(".calls > .value") as HTMLElement;
    }

    updateFPS(fps: number): void {
        const color = fps >= 30 ? "green" : "red";
        this.#fpsValueElem.classList.remove("green", "red");
        this.#fpsValueElem.classList.add(color);

        this.#fpsValueElem.innerText = fps.toString();
    }

    updateInfo(info: RendererInfo): void {
        this.#texturesValueElem.innerText = info.memory.textures.toString();
        this.#geometriesValueElem.innerText = info.memory.geometries.toString();
        this.#pointsValueElem.innerText = info.render.points.toString();
        this.#trianglesValueElem.innerText = info.render.triangles.toString();
        this.#linesValueElem.innerText = info.render.lines.toString();
        this.#callsValueElem.innerText = info.render.calls.toString();
    }
}

export { DebuggerRendererStatsElement };

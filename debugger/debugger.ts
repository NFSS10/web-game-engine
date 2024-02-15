import { Scene } from "@src/scene";
import { DebuggerWindowElement, DebuggerStatsElement } from "./elements";

abstract class Debugger {
    static #enabled = false;
    static #scene: Scene;

    static #windowElem: HTMLElement;
    static #statsElem: HTMLElement;

    static init(): void {
        // register debugger components
        if (!customElements.get("debugger-window")) customElements.define("debugger-window", DebuggerWindowElement);
        if (!customElements.get("debugger-stats")) customElements.define("debugger-stats", DebuggerStatsElement);
    }

    static get enabled(): boolean {
        return this.#enabled;
    }

    static enable(): void {
        this.#enabled = true;
    }

    static disable(): void {
        this.#enabled = false;
    }

    static setScene(scene: Scene): void {
        this.#scene = scene;
        // TODO: Add debug drawer
    }

    static attachToElement(element: HTMLElement): void {
        if (this.#statsElem) this.#statsElem.remove();
        if (this.#windowElem) this.#windowElem.remove();

        this.#statsElem = new DebuggerStatsElement();
        this.#windowElem = new DebuggerWindowElement();
        this.#windowElem.shadowRoot?.appendChild(this.#statsElem);

        element.appendChild(this.#windowElem);
    }

    static onPhysicsTick(): void {
        if (!this.#enabled) return;
        console.log("Physics ticked");
    }

    static onRender(): void {
        if (!this.#enabled) return;
        console.log("Tick");
    }

    // static #createDebugDrawer(): void {
    //     // TODO: Create debug drawer
    // }
}

export { Debugger };

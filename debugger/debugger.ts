import { Scene } from "@src/scene";
import { DebuggerWindowElement } from "./elements";

abstract class Debugger {
    static #enabled = false;
    static #scene: Scene;

    static init(): void {
        // register debugger components
        if (!customElements.get("debugger-window")) customElements.define("debugger-window", DebuggerWindowElement);
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
        //////// TODO: destroy previous debugger window
        // attaches the debugger window to the game window
        const debuggerWindow = new DebuggerWindowElement();
        element.appendChild(debuggerWindow);
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

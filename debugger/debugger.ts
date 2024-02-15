import { Scene } from "@src/scene";
import { DebuggerWindowElement, DebuggerStatsElement } from "./elements";
import { FPSCounter } from "./lib";

const UI_UPDATE_INTERVAL_MS = 500;

abstract class Debugger {
    static #enabled = false;
    static #scene: Scene;

    static #windowElem: DebuggerWindowElement;
    static #statsElem: DebuggerStatsElement;

    static #lastUpdateUITime: number;
    static #fpsCounter: FPSCounter;

    static init(): void {
        // register debugger components
        if (!customElements.get("debugger-window")) customElements.define("debugger-window", DebuggerWindowElement);
        if (!customElements.get("debugger-stats")) customElements.define("debugger-stats", DebuggerStatsElement);

        this.#fpsCounter = new FPSCounter();
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

        this.#fpsCounter.tick();

        this.#updateUI();
    }

    // static #createDebugDrawer(): void {
    //     // TODO: Create debug drawer
    // }

    static #updateUI(): void {
        const now = Date.now();
        if (now - this.#lastUpdateUITime < UI_UPDATE_INTERVAL_MS) return;

        this.#statsElem?.updateFPS(this.#fpsCounter.fps);
        this.#lastUpdateUITime = now;
    }
}

export { Debugger };

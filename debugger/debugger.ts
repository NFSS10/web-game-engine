import { Scene } from "@src/scene";
import { DebuggerWindowElement, DebuggerRendererStatsElement } from "./elements";
import { FPSCounter } from "./lib";

const UI_UPDATE_INTERVAL_MS = 500;

abstract class Debugger {
    static #enabled = false;
    static #renderer: THREE.WebGLRenderer;
    static #scene: Scene;

    static #windowElem: DebuggerWindowElement;
    static #statsElem: DebuggerRendererStatsElement;

    static #lastUpdateUITime: number;
    static #fpsCounter: FPSCounter;

    static init(): void {
        this.#fpsCounter = new FPSCounter();

        // register debugger components
        if (!customElements.get("debugger-window")) customElements.define("debugger-window", DebuggerWindowElement);
        if (!customElements.get("debugger-stats")) customElements.define("debugger-stats", DebuggerRendererStatsElement);
    }

    static get enabled(): boolean {
        return this.#enabled;
    }

    static enable(): void {
        this.#enabled = true;
        if (this.#windowElem) this.#windowElem.style.display = "";
    }

    static disable(): void {
        this.#enabled = false;
        if (this.#windowElem) this.#windowElem.style.display = "none";
    }

    static setRenderer(renderer: THREE.WebGLRenderer): void {
        this.#renderer = renderer;
    }

    static setScene(scene: Scene): void {
        this.#scene = scene;
        // TODO: Add debug drawer
    }

    static attachToElement(element: HTMLElement): void {
        if (this.#statsElem) this.#statsElem.remove();
        if (this.#windowElem) this.#windowElem.remove();

        this.#statsElem = new DebuggerRendererStatsElement();
        this.#windowElem = new DebuggerWindowElement();
        this.#windowElem.shadowRoot?.appendChild(this.#statsElem);
        this.#windowElem.style.display = this.#enabled ? "" : "none";

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
        if (!this.#enabled) return;

        const now = Date.now();
        if (now - this.#lastUpdateUITime < UI_UPDATE_INTERVAL_MS) return;

        this.#statsElem?.updateFPS(this.#fpsCounter.fps);
        this.#statsElem?.updateInfo(this.#renderer.info);
        this.#lastUpdateUITime = now;
    }
}

export { Debugger };

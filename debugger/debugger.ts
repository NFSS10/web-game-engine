import { Scene } from "@src/scene";
import { DebuggerWindowElement, DebuggerRendererStatsElement } from "./elements";
import { FPSCounter, PhysicsDrawer } from "./lib";

const UI_UPDATE_INTERVAL_MS = 500;

abstract class Debugger {
    static #enabled = false;
    static #renderer: THREE.WebGLRenderer;
    static #scene: Scene;

    static #windowElem: DebuggerWindowElement;
    static #statsElem: DebuggerRendererStatsElement;

    static #lastUpdateUITime: number;
    static #fpsCounter: FPSCounter;
    static #physicsDrawer: PhysicsDrawer;

    static init(): void {
        this.#fpsCounter = new FPSCounter();
        this.#physicsDrawer = new PhysicsDrawer();

        // register debugger components
        if (!customElements.get("debugger-window")) customElements.define("debugger-window", DebuggerWindowElement);
        if (!customElements.get("debugger-renderer-stats"))
            customElements.define("debugger-renderer-stats", DebuggerRendererStatsElement);
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
        this.#scene.world.physicsWorld.setDebugDrawer(this.#physicsDrawer.debugDrawer);
        this.#scene.scene.add(this.#physicsDrawer.lineMesh);
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

        this.#scene.world.physicsWorld.debugDrawWorld();
    }

    static onRender(): void {
        if (!this.#enabled) return;

        this.#fpsCounter.tick();
        this.#physicsDrawer.draw();

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

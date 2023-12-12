import { Module } from "@modules";
import { Camera } from "@src/camera";
import { Renderer } from "@src/renderer";
import { ModuleLoader, ModuleType } from "@src/loaders";
import { Scene } from "./scene";

class GameEngine {
    VERSION = "<%VERSION%>";

    #running = false;
    #element: HTMLElement;
    #renderer: Renderer;
    #camera: Camera;
    #scene: Scene;

    async init(width?: number, height?: number): Promise<void> {
        width = width ?? 768;
        height = height ?? 768;

        this.#buildElement();

        this.#camera = new Camera(45, width / height);
        this.#scene = new Scene("default");
        this.#renderer = new Renderer(this.#element, width, height);
    }

    get canvas(): HTMLElement {
        return this.#element;
    }

    async loadModule(name: ModuleType): Promise<Module> {
        const module = await ModuleLoader.loadModule(name);
        return module;
    }

    start(): void {
        this.#running = true;
        this.#loop();
    }

    stop(): void {
        this.#running = false;
    }

    setScene(scene: Scene): void {
        this.#scene = scene;
    }

    #buildElement(): void {
        this.#element = document.createElement("game-window");
    }

    #loop(): void {
        if (!this.#running) return;

        this.#renderer.render(this.#scene, this.#camera);

        requestAnimationFrame(() => this.#loop());
    }
}

export { GameEngine };
export default GameEngine;

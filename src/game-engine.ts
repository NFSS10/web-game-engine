import * as THREE from "three";

import { Debugger } from "@debugger";
import { Module } from "@modules";
import { Camera } from "@src/camera";
import { ModuleLoader, ModuleType } from "@src/loaders";
import { Physics } from "@src/physics";
import { Renderer } from "@src/renderer";
import { Scene } from "@src/scene";

class GameEngine {
    VERSION = "<%VERSION%>";

    #running = false;
    #element: HTMLElement;
    #clock: THREE.Clock;
    #renderer: Renderer;
    #camera: Camera;
    #scene: Scene;

    async init(width?: number, height?: number): Promise<void> {
        width = width ?? 768;
        height = height ?? 768;

        await Physics.init();

        this.#buildElement();

        this.#clock = new THREE.Clock();
        this.#camera = new Camera(45, width / height);
        this.#scene = new Scene("default");
        this.#renderer = new Renderer(this.#element, width, height);
    }

    get canvas(): HTMLElement {
        return this.#element;
    }

    get debugger(): Debugger {
        return Debugger;
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
        Debugger.setScene(scene);
    }

    #buildElement(): void {
        this.#element = document.createElement("game-window");
    }

    #loop(): void {
        if (!this.#running) return;

        const dt = this.#clock.getDelta();
        this.#scene.tickPhysics(dt);
        Debugger.onPhysicsTick();

        this.#renderer.render(this.#scene, this.#camera);
        Debugger.onRender();

        requestAnimationFrame(() => this.#loop());
    }
}

export { GameEngine };
export default GameEngine;

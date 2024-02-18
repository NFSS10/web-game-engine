import * as THREE from "three";

import { Debugger } from "@debugger";
import { Module } from "@modules";
import { Camera } from "@src/camera";
import { AssetLoader, ModuleLoader, ModuleType } from "@src/loaders";
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

        // initialize the physics engine
        await Physics.init();

        // initialize the debugger
        Debugger.init();

        // create the game window element
        this.#buildElement();

        // initialize the rest of the game engine
        this.#clock = new THREE.Clock();
        this.#camera = new Camera(45, width / height);
        this.#scene = new Scene("default");
        this.#renderer = new Renderer(this.#element, width, height);

        // initialize the loaders
        AssetLoader.init(this.#renderer.renderer);
        ModuleLoader.init(this);

        Debugger.setRenderer(this.#renderer.renderer);
        Debugger.setScene(this.#scene);
    }

    get canvas(): HTMLElement {
        return this.#element;
    }

    get loader(): AssetLoader {
        return AssetLoader;
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
        // creates the game window element
        this.#element = document.createElement("game-window");
        this.#element.style.position = "relative";
        this.#element.style.display = "inline-block";

        Debugger.attachToElement(this.#element);
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

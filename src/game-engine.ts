import * as THREE from "three";

import { Camera } from "./camera";
import { Renderer } from "./renderer";

class GameEngine {
    VERSION = "<%VERSION%>";

    #running = false;
    #element: HTMLElement;
    #renderer: Renderer;
    #camera: Camera;
    #scene: THREE.Scene;

    constructor(width?: number, height?: number) {
        width = width ?? 768;
        height = height ?? 768;

        this.#buildElement();

        this.#camera = new Camera(45, width / height);
        this.#renderer = new Renderer(this.#element, width, height);

        this.#testScene();
    }

    get canvas(): HTMLElement {
        return this.#element;
    }

    start(): void {
        this.#running = true;
        this.#loop();
    }

    stop(): void {
        this.#running = false;
    }

    #buildElement(): void {
        this.#element = document.createElement("game-window");
    }

    #loop(): void {
        if (!this.#running) return;

        this.#renderer.render(this.#scene, this.#camera);

        requestAnimationFrame(() => this.#loop());
    }

    #testScene(): void {
        this.#scene = new THREE.Scene();

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        cube.position.z = -5;
        cube.rotateX(0.35);
        cube.rotateY(0.35);

        this.#scene.add(cube);
    }
}

export { GameEngine };
export default GameEngine;

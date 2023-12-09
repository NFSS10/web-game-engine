import * as THREE from "three";

import { type Camera } from "../camera";

type RendererOptions = {
    antialias?: boolean;
    alpha?: boolean;
};

class Renderer {
    #renderer: THREE.WebGLRenderer;

    constructor(element: HTMLElement, width: number, height: number, options?: RendererOptions) {
        const antialias = options?.antialias ?? true;
        const alpha = options?.alpha ?? true;

        // init renderer
        this.#renderer = new THREE.WebGLRenderer({ antialias: antialias, alpha: alpha });
        this.#renderer.setSize(width, height);
        this.#renderer.setPixelRatio(window.devicePixelRatio);

        // tone mapping
        this.#renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.#renderer.toneMappingExposure = 1;

        element.appendChild(this.#renderer.domElement);
    }

    render(scene: THREE.Scene, camera: Camera): void {
        this.#renderer.render(scene, camera.camera);
    }
}

export { Renderer };

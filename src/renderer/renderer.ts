import * as THREE from "three";

import { type Camera } from "@src/camera";
import { type Scene } from "@src/scene";

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
        this.#renderer.shadowMap.enabled = true;

        // tone mapping
        this.#renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.#renderer.toneMappingExposure = 1;

        element.appendChild(this.#renderer.domElement);
    }

    get renderer(): THREE.WebGLRenderer {
        return this.#renderer;
    }

    render(scene: Scene, camera: Camera): void {
        this.#renderer.render(scene.scene, camera.camera);
    }
}

export { Renderer };

import * as THREE from "three";

type CameraOptions = {
    near?: number;
    far?: number;
};

class Camera {
    #camera: THREE.PerspectiveCamera;

    constructor(fov: number, aspect: number, options?: CameraOptions) {
        const near = options?.near ?? 0.01;
        const far = options?.far ?? 1000;

        this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        // TODO: Remove this test code
        this.#camera.position.set(-4, 2.5, 13);
        this.#camera.lookAt(0, -2, 0);
    }

    get camera(): THREE.PerspectiveCamera {
        return this.#camera;
    }
}

export { Camera };

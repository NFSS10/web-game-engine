import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { KinematicCharacterEntity } from "./kinematic-character";

class TestCharacter extends KinematicCharacterEntity {
    constructor(options?: EntityOptions) {
        const capsule = createMesh();
        super(capsule, options);
    }
}

const createMesh = (): THREE.Object3D => {
    const geometry = new THREE.CapsuleGeometry(0.5, 1);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.3, 0.5, 0.5);
    mesh.add(leftEye);

    // right eye
    const rightEye = leftEye.clone();
    rightEye.position.x = -leftEye.position.x;
    mesh.add(rightEye);

    return mesh;
};

export { TestCharacter };

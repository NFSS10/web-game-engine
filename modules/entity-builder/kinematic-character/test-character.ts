import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { KinematicCharacterEntity } from "./kinematic-character";

class TestCharacter extends KinematicCharacterEntity {
    constructor(options?: EntityOptions) {
        const capsule = createCapsuleMesh();
        super(capsule, options);
    }
}

const createCapsuleMesh = (): THREE.Object3D => {
    const geometry = new THREE.CapsuleGeometry(0.5, 1);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

export { TestCharacter };

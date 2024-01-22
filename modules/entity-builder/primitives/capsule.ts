import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { Physics } from "@src/physics";
import { type BodyOptions } from "@src/physics/types";
import { PrimitiveEntity } from "./base";

class Capsule extends PrimitiveEntity {
    constructor(options: EntityOptions) {
        const object = createCapsuleMesh();
        super(object, options);
    }

    _createBody(options?: BodyOptions): void {
        if (this.bodies.length > 0) return;
        const body = Physics.createCapsuleBody(0.5, 1, this.object, options);
        this.bodies.push(body);
    }
}

const createCapsuleMesh = (): THREE.Object3D => {
    const geometry = new THREE.CapsuleGeometry(0.5, 1);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

export { Capsule };

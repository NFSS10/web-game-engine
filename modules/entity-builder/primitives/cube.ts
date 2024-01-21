import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { Physics } from "@src/physics";
import { type BodyOptions } from "@src/physics/types";
import { PrimitiveEntity } from "./base";

class Cube extends PrimitiveEntity {
    constructor(options: EntityOptions) {
        const object = createCubeMesh();
        super(object, options);
    }

    _createBody(options?: BodyOptions): void {
        if (this.bodies.length > 0) return;
        const body = Physics.createBody(this.object, options);
        this.bodies.push(body);
    }
}

const createCubeMesh = (): THREE.Object3D => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    // TODO: remove this test code
    mesh.position.z = -5;
    mesh.rotateX(0.35);
    mesh.rotateY(0.35);

    return mesh;
};

export { Cube };

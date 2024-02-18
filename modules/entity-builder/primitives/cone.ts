import * as THREE from "three";

import { type EntityOptions, type CreateBodyOptions } from "@src/entity/types";
import { Physics } from "@src/physics";
import { PrimitiveEntity } from "./base";

class Cone extends PrimitiveEntity {
    constructor(options: EntityOptions) {
        const object = createConeMesh();
        super(object, options);
    }

    _createBody(options?: CreateBodyOptions): void {
        if (this.bodies.length > 0) return;
        const body = Physics.createConeBody(0.5, 1, this.object, options);
        this.bodies.push(body);
    }
}

const createConeMesh = (): THREE.Object3D => {
    const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

export { Cone };

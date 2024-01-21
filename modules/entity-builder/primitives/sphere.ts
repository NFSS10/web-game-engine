import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { Physics } from "@src/physics";
import { type BodyOptions } from "@src/physics/types";
import { PrimitiveEntity } from "./base";

class Sphere extends PrimitiveEntity {
    constructor(options: EntityOptions) {
        const object = createSphereMesh();
        super(object, options);
    }

    _createBody(options?: BodyOptions): void {
        // TODO: implement this
        if (this.bodies.length > 0) return;
        const body = Physics.createBody(this.object, options);
        this.bodies.push(body);
    }
}

const createSphereMesh = (): THREE.Object3D => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

export { Sphere };

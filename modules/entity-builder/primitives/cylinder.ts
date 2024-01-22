import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { Physics } from "@src/physics";
import { type BodyOptions } from "@src/physics/types";
import { PrimitiveEntity } from "./base";

class Cylinder extends PrimitiveEntity {
    constructor(options: EntityOptions) {
        const object = createCylinderMesh();
        super(object, options);
    }

    _createBody(options?: BodyOptions): void {
        if (this.bodies.length > 0) return;
        const body = Physics.createCylinderBody(0.5, 1, this.object, options);
        this.bodies.push(body);
    }
}

const createCylinderMesh = (): THREE.Object3D => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

export { Cylinder };

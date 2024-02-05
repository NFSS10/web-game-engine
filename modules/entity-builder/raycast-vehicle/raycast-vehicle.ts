import * as THREE from "three";

import { Entity } from "@src/entity";

class RaycastVehicleEntity extends Entity {
    constructor() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        super(mesh);
    }

    tickBodies(): void {
        return;
    }
}

export { RaycastVehicleEntity };

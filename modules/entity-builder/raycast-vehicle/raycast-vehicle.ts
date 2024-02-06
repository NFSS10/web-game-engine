import * as THREE from "three";

import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Physics } from "@src/physics";

class RaycastVehicleEntity extends Entity {
    #chassisMesh: THREE.Object3D;

    constructor(options?: EntityOptions) {
        const chassis = createChassis();

        const mesh = new THREE.Object3D();
        mesh.add(chassis);

        super(mesh);

        this.#chassisMesh = chassis;
    }

    tickBodies(): void {
        return;
    }
}

const createChassis = (): THREE.Object3D => {
    const chassis = new THREE.Object3D();
    
    const material = new THREE.MeshNormalMaterial();
    
    const baseGeo = new THREE.BoxGeometry(2, 1, 5);
    const baseMesh = new THREE.Mesh(baseGeo, material);
    chassis.add(baseMesh);

    const topGeo = new THREE.BoxGeometry(2, 0.75, 3);
    const topMesh = new THREE.Mesh(topGeo, material);
    topMesh.position.set(0, 0.75, -0.5);
    chassis.add(topMesh);

    return chassis;
}

export { RaycastVehicleEntity };

import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { RaycastVehicleEntity } from "./raycast-vehicle";

class CarEntity extends RaycastVehicleEntity {
    constructor(options?: EntityOptions) {
        const chassis = createChassis();
        const frontLeftWheel = createWheel();
        frontLeftWheel.position.set(-1, -0.5, 1);
        const frontRightWheel = createWheel();
        frontRightWheel.position.set(1, -0.5, 1);
        const backLeftWheel = createWheel();
        backLeftWheel.position.set(-1, -0.5, -2);
        const backRightWheel = createWheel();
        backRightWheel.position.set(1, -0.5, -2);
        super(chassis, frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel, options);
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
};

const createWheel = (): THREE.Object3D => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

export { CarEntity };

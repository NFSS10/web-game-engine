import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { RaycastVehicleEntity } from "./raycast-vehicle";
import { WheelIndex, WheelState } from "./enums";

class CarEntity extends RaycastVehicleEntity {
    constructor(options?: EntityOptions) {
        const chassis = createChassis();
        const frontLeftWheel = createWheel();
        frontLeftWheel.position.set(1, -0.5, 1);
        const frontRightWheel = createWheel();
        frontRightWheel.position.set(-1, -0.5, 1);
        const backLeftWheel = createWheel();
        backLeftWheel.position.set(1, -0.5, -2);
        const backRightWheel = createWheel();
        backRightWheel.position.set(-1, -0.5, -2);

        super(chassis, frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel, options);

        this.setWheelProperties(WheelIndex.FRONT_LEFT, {
            isFrontWheel: true
        });
        this.setWheelProperties(WheelIndex.FRONT_RIGHT, {
            isFrontWheel: true
        });
    }

    accelerate(): void {
        this.setWheelState(WheelIndex.FRONT_LEFT, WheelState.ACCELERATING);
    }

    brake(): void {
        this.setWheelState(WheelIndex.FRONT_LEFT, WheelState.BRAKING);
        this.setWheelState(WheelIndex.FRONT_RIGHT, WheelState.BRAKING);
        this.setWheelState(WheelIndex.BACK_LEFT, WheelState.BRAKING);
        this.setWheelState(WheelIndex.BACK_RIGHT, WheelState.BRAKING);
    }

    handbrake(): void {
        this.setWheelState(WheelIndex.FRONT_LEFT, WheelState.NONE);
        this.setWheelState(WheelIndex.FRONT_RIGHT, WheelState.NONE);
        this.setWheelState(WheelIndex.BACK_LEFT, WheelState.BRAKING);
        this.setWheelState(WheelIndex.BACK_RIGHT, WheelState.BRAKING);
    }

    reverse(): void {
        if (this.speed > 0) {
            this.brake();
            return;
        }

        this.setWheelState(WheelIndex.BACK_LEFT, WheelState.REVERSING);
        this.setWheelState(WheelIndex.BACK_RIGHT, WheelState.REVERSING);
    }

    steerLeft(): void {
        this.setWheelState(WheelIndex.FRONT_LEFT, WheelState.STEERING_LEFT);
        this.setWheelState(WheelIndex.FRONT_RIGHT, WheelState.STEERING_LEFT);
    }

    steerRight(): void {
        this.setWheelState(WheelIndex.FRONT_LEFT, WheelState.STEERING_RIGHT);
        this.setWheelState(WheelIndex.FRONT_RIGHT, WheelState.STEERING_RIGHT);
    }

    toggleHeadlights(): void {
        // TODO
    }

    horn(): void {
        // TODO
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

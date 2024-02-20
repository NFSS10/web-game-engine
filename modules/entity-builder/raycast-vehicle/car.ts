import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { RaycastVehicleEntity } from "./raycast-vehicle";
import { WheelIndex, MovementState, SteeringState } from "./enums";

class Car extends RaycastVehicleEntity {
    constructor(options?: EntityOptions) {
        const chassis = createChassis();
        const frontLeftWheel = createWheel();
        frontLeftWheel.position.set(1, -0.5, 1.5);
        const frontRightWheel = createWheel();
        frontRightWheel.position.set(-1, -0.5, 1.5);
        const backLeftWheel = createWheel();
        backLeftWheel.position.set(1, -0.5, -1.7);
        const backRightWheel = createWheel();
        backRightWheel.position.set(-1, -0.5, -1.7);

        super(chassis, frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel, options);

        this.setWheelProperties(WheelIndex.FRONT_LEFT, {
            isFrontWheel: true
        });
        this.setWheelProperties(WheelIndex.FRONT_RIGHT, {
            isFrontWheel: true
        });
    }

    clearMovementState(): void {
        this.setMovementState(WheelIndex.FRONT_LEFT, MovementState.NONE);
        this.setMovementState(WheelIndex.FRONT_RIGHT, MovementState.NONE);
        this.setMovementState(WheelIndex.BACK_LEFT, MovementState.NONE);
        this.setMovementState(WheelIndex.BACK_RIGHT, MovementState.NONE);
    }

    accelerate(): void {
        this.setMovementState(WheelIndex.BACK_LEFT, MovementState.ACCELERATING);
        this.setMovementState(WheelIndex.BACK_RIGHT, MovementState.ACCELERATING);
    }

    brake(): void {
        this.setMovementState(WheelIndex.FRONT_LEFT, MovementState.BRAKING);
        this.setMovementState(WheelIndex.FRONT_RIGHT, MovementState.BRAKING);
        this.setMovementState(WheelIndex.BACK_LEFT, MovementState.BRAKING);
        this.setMovementState(WheelIndex.BACK_RIGHT, MovementState.BRAKING);
    }

    handbrake(): void {
        this.setMovementState(WheelIndex.FRONT_LEFT, MovementState.NONE);
        this.setMovementState(WheelIndex.FRONT_RIGHT, MovementState.NONE);
        this.setMovementState(WheelIndex.BACK_LEFT, MovementState.BRAKING);
        this.setMovementState(WheelIndex.BACK_RIGHT, MovementState.BRAKING);
    }

    reverse(): void {
        if (this.speed > 0) {
            this.brake();
            return;
        }

        this.setMovementState(WheelIndex.BACK_LEFT, MovementState.REVERSING);
        this.setMovementState(WheelIndex.BACK_RIGHT, MovementState.REVERSING);
    }

    steerNone(): void {
        this.setSteeringState(WheelIndex.FRONT_LEFT, SteeringState.NONE);
        this.setSteeringState(WheelIndex.FRONT_RIGHT, SteeringState.NONE);
    }

    steerLeft(): void {
        this.setSteeringState(WheelIndex.FRONT_LEFT, SteeringState.LEFT);
        this.setSteeringState(WheelIndex.FRONT_RIGHT, SteeringState.LEFT);
    }

    steerRight(): void {
        this.setSteeringState(WheelIndex.FRONT_LEFT, SteeringState.RIGHT);
        this.setSteeringState(WheelIndex.FRONT_RIGHT, SteeringState.RIGHT);
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

    const baseGeo = new THREE.BoxGeometry(2, 1, 5);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x020035, metalness: 1, roughness: 0.15 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMaterial);
    chassis.add(baseMesh);

    const topGeo = new THREE.BoxGeometry(1.9, 0.75, 3);
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0xd1dfe7, metalness: 1, roughness: 0.25 });
    const topMesh = new THREE.Mesh(topGeo, topMaterial);
    topMesh.position.set(0, 0.75, -0.5);
    chassis.add(topMesh);

    return chassis;
};

const createWheel = (): THREE.Object3D => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
    geometry.rotateZ(Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x292929 });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

export { Car };

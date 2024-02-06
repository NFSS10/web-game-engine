import * as THREE from "three";
import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Physics, World } from "@src/physics";
import { ObjectUtils } from "@src/entity/utils";
import { WheelOptions } from "./types";
import { WheelIndex, WheelState } from "./enums";

class RaycastVehicleEntity extends Entity {
    #chassisMesh: THREE.Object3D;
    #wheelsMeshes: THREE.Object3D[] = [];
    #chassisBody: Ammo.btRigidBody;
    #vehicle: Ammo.btRaycastVehicle;
    #currentSpeed: number = 0;

    constructor(
        chassis: THREE.Object3D,
        leftFrontWheel: THREE.Object3D,
        rightFrontWheel: THREE.Object3D,
        leftBackWheel: THREE.Object3D,
        rightBackWheel: THREE.Object3D,
        options?: EntityOptions
    ) {
        // creates the car object
        const car = new THREE.Object3D();
        car.add(chassis);
        car.add(leftFrontWheel);
        car.add(rightFrontWheel);
        car.add(leftBackWheel);
        car.add(rightBackWheel);

        super(car, options);
        this.#chassisMesh = chassis;

        // register the wheels. The order matters here,
        // it follows the order of the WheelIndex enum
        this.#wheelsMeshes.push(leftFrontWheel);
        this.#wheelsMeshes.push(rightFrontWheel);
        this.#wheelsMeshes.push(leftBackWheel);
        this.#wheelsMeshes.push(rightBackWheel);
    }

    get speed(): number {
        return this.#currentSpeed;
    }

    _createBody(): void {
        if (this.bodies.length > 0) return;
        this.#chassisBody = Physics.createBoxBody(this.#chassisMesh);
        this.bodies.push(this.#chassisBody);
    }

    _onAddToWorld(world: World): void {
        const rayCaster = new Physics.Ammo.btDefaultVehicleRaycaster(world.physicsWorld);

        const tuning = new Physics.Ammo.btVehicleTuning();
        this.#vehicle = new Physics.Ammo.btRaycastVehicle(tuning, this.#chassisBody, rayCaster);

        // x is right axis, y is up axis, z is forward axis
        this.#vehicle.setCoordinateSystem(0, 1, 2);

        world.physicsWorld.addAction(this.#vehicle);

        // the order matters here, it follows the order of the WheelIndex enum
        this.#createWheel(this.#vehicle, tuning, this.#wheelsMeshes[WheelIndex.FRONT_LEFT]!, { isFrontWheel: true });
        this.#createWheel(this.#vehicle, tuning, this.#wheelsMeshes[WheelIndex.FRONT_RIGHT]!, { isFrontWheel: true });
        this.#createWheel(this.#vehicle, tuning, this.#wheelsMeshes[WheelIndex.BACK_LEFT]!, { isFrontWheel: false });
        this.#createWheel(this.#vehicle, tuning, this.#wheelsMeshes[WheelIndex.BACK_RIGHT]!, { isFrontWheel: false });
    }

    tickBodies(): void {
        this.#currentSpeed = this.#vehicle.getCurrentSpeedKmHour();

        const engineForce = 0.5; // TODO: support customizing engine force
        this.#vehicle.applyEngineForce(engineForce, WheelIndex.BACK_LEFT);
        this.#vehicle.applyEngineForce(engineForce, WheelIndex.BACK_RIGHT);

        let tm, p, q, i;
        const n = this.#vehicle.getNumWheels();
        for (i = 0; i < n; i++) {
            this.#vehicle.updateWheelTransform(i, true);
            tm = this.#vehicle.getWheelTransformWS(i);
            p = tm.getOrigin();
            q = tm.getRotation();
            this.#wheelsMeshes[i]!.position.set(p.x(), p.y(), p.z());
            this.#wheelsMeshes[i]!.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        tm = this.#vehicle.getChassisWorldTransform();
        p = tm.getOrigin();
        q = tm.getRotation();
        this.#chassisMesh.position.set(p.x(), p.y(), p.z());
        this.#chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }

    destroy(): void {
        super.destroy();

        // TODO
    }

    #createWheel(
        vehicle: Ammo.btRaycastVehicle,
        tuning: Ammo.btVehicleTuning,
        object: THREE.Object3D,
        options?: WheelOptions
    ): void {
        const isFrontWheel = options?.isFrontWheel ?? false;
        const friction = options?.friction ?? 1000;
        const suspensionStiffness = options?.suspensionStiffness ?? 15.0;
        const suspensionDamping = options?.suspensionDamping ?? 0.5;
        const suspensionCompression = options?.suspensionCompression ?? 5.0;
        const suspensionRestLength = options?.suspensionRestLength ?? 0.5;
        const rollInfluence = options?.rollInfluence ?? 0.5;

        let radius = options?.radius || null;
        if (!radius) {
            const size = ObjectUtils.getBoundingBoxSize(object);
            radius = size.y / 2;
        }

        // wheels direction and axle setup
        const wheelDirectionCS0 = new Physics.Ammo.btVector3(0, -1, 0);
        const wheelAxleCS = new Physics.Ammo.btVector3(-1, 0, 0);

        const position = new Physics.Ammo.btVector3(object.position.x, object.position.y, object.position.z);

        // if radius is not passed, calculate it from the object size
        if (!radius) {
            const size = ObjectUtils.getBoundingBoxSize(object);
            radius = size.y / 2;
        }

        const wheelInfo = vehicle.addWheel(
            position,
            wheelDirectionCS0,
            wheelAxleCS,
            suspensionRestLength,
            radius,
            tuning,
            isFrontWheel
        );
        wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
        wheelInfo.set_m_frictionSlip(friction);
        wheelInfo.set_m_rollInfluence(rollInfluence);
    }
}

export { RaycastVehicleEntity };

import * as THREE from "three";
import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Physics, World } from "@src/physics";
import { ObjectUtils } from "@src/entity/utils";
import { type WheelData, type WheelOptions } from "./types";
import { WheelIndex, WheelState } from "./enums";

class RaycastVehicleEntity extends Entity {
    #chassisMesh: THREE.Object3D;
    #chassisBody: Ammo.btRigidBody;
    #vehicle: Ammo.btRaycastVehicle;
    #currentSpeed: number = 0;

    #wheelStates: Record<WheelIndex, WheelData>;

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

        // register the wheels
        const defaultOptions = {
            engineForce: 0.5,
            brakeForce: 0.5,
            isFrontWheel: false,
            radius: 0,
            friction: 1000,
            suspensionStiffness: 15.0,
            suspensionDamping: 0.5,
            suspensionCompression: 5.0,
            suspensionRestLength: 0.5,
            rollInfluence: 0.5
        };
        this.#wheelStates = {} as Record<WheelIndex, WheelData>;
        this.#wheelStates[WheelIndex.FRONT_LEFT] = {
            mesh: leftFrontWheel,
            state: WheelState.NONE,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.FRONT_RIGHT] = {
            mesh: rightFrontWheel,
            state: WheelState.NONE,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.BACK_LEFT] = {
            mesh: leftBackWheel,
            state: WheelState.NONE,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.BACK_RIGHT] = {
            mesh: rightBackWheel,
            state: WheelState.NONE,
            options: { ...defaultOptions }
        };
    }

    get speed(): number {
        return this.#currentSpeed;
    }

    setWheelProperties(wheel: WheelIndex, options: WheelOptions): RaycastVehicleEntity {
        // TODO

        return this;
    }

    setWheelState(wheel: WheelIndex, state: WheelState): void {
        this.#wheelStates[wheel].state = state;
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
        this.#createWheel(WheelIndex.FRONT_LEFT, this.#vehicle, tuning);
        this.#createWheel(WheelIndex.FRONT_RIGHT, this.#vehicle, tuning);
        this.#createWheel(WheelIndex.BACK_LEFT, this.#vehicle, tuning);
        this.#createWheel(WheelIndex.BACK_RIGHT, this.#vehicle, tuning);
    }

    tickBodies(): void {
        this.#currentSpeed = this.#vehicle.getCurrentSpeedKmHour();

        const engineForce = 0.5; // TODO: support customizing engine force
        this.#vehicle.applyEngineForce(engineForce, WheelIndex.BACK_LEFT);
        this.#vehicle.applyEngineForce(engineForce, WheelIndex.BACK_RIGHT);

        let tm, p, q, i;
        const n = this.#vehicle.getNumWheels();
        for (i = 0; i < n; i++) {
            i = i as WheelIndex;

            this.#vehicle.updateWheelTransform(i, true);
            tm = this.#vehicle.getWheelTransformWS(i);
            p = tm.getOrigin();
            q = tm.getRotation();
            this.#wheelStates[i].mesh.position.set(p.x(), p.y(), p.z());
            this.#wheelStates[i].mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
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

    #createWheel(wheelIdx: WheelIndex, vehicle: Ammo.btRaycastVehicle, tuning: Ammo.btVehicleTuning): void {
        const wheelData = this.#wheelStates[wheelIdx];

        const isFrontWheel = wheelData.options.isFrontWheel;
        const friction = wheelData.options.friction;
        const suspensionStiffness = wheelData.options.suspensionStiffness;
        const suspensionDamping = wheelData.options.suspensionDamping;
        const suspensionCompression = wheelData.options.suspensionCompression;
        const suspensionRestLength = wheelData.options.suspensionRestLength;
        const rollInfluence = wheelData.options.rollInfluence;

        // if radius is not passed, calculate it from the object size
        let radius = wheelData.options.radius || null;
        if (!radius) {
            const size = ObjectUtils.getBoundingBoxSize(wheelData.mesh);
            radius = size.y / 2;
        }

        // calculate position based on position
        const position = new Physics.Ammo.btVector3(
            wheelData.mesh.position.x,
            wheelData.mesh.position.y,
            wheelData.mesh.position.z
        );

        // wheels direction and axle setup
        const wheelDirectionCS0 = new Physics.Ammo.btVector3(0, -1, 0);
        const wheelAxleCS = new Physics.Ammo.btVector3(-1, 0, 0);

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
        this.#wheelStates[wheelIdx].wheelInfo = wheelInfo;
    }
}

export { RaycastVehicleEntity };

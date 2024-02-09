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
        const defaultOptions: WheelOptions = {
            engineForce: 0.5,
            brakeForce: 0.05,
            steeringLimit: 0.65,
            steeringIncrement: 1.5,
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
            steeringValue: 0,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.FRONT_RIGHT] = {
            mesh: rightFrontWheel,
            state: WheelState.NONE,
            steeringValue: 0,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.BACK_LEFT] = {
            mesh: leftBackWheel,
            state: WheelState.NONE,
            steeringValue: 0,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.BACK_RIGHT] = {
            mesh: rightBackWheel,
            state: WheelState.NONE,
            steeringValue: 0,
            options: { ...defaultOptions }
        };
    }

    get speed(): number {
        return this.#currentSpeed;
    }

    setWheelProperties(wheel: WheelIndex, options: Partial<WheelOptions>): RaycastVehicleEntity {
        // update the wheel options
        const wheelData = this.#wheelStates[wheel];
        wheelData.options = {
            ...this.#wheelStates[wheel].options,
            ...options
        };

        // apply the new options to the wheel
        const wheelInfo = this.#vehicle.getWheelInfo(wheel);
        wheelInfo.set_m_bIsFrontWheel(wheelData.options.isFrontWheel);
        wheelInfo.set_m_wheelsRadius(wheelData.options.radius);
        wheelInfo.set_m_frictionSlip(wheelData.options.friction);
        wheelInfo.set_m_suspensionStiffness(wheelData.options.suspensionStiffness);
        wheelInfo.set_m_wheelsDampingRelaxation(wheelData.options.suspensionDamping);
        wheelInfo.set_m_wheelsDampingCompression(wheelData.options.suspensionCompression);
        wheelInfo.set_m_rollInfluence(wheelData.options.rollInfluence);

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

    tickBodies(dt: number): void {
        this.#currentSpeed = this.#vehicle.getCurrentSpeedKmHour();

        const wheelsNum = this.#vehicle.getNumWheels();

        this.#tickWheelsState(dt, wheelsNum, this.#vehicle, this.#currentSpeed);

        let transform, pos, quart, i;
        for (i = 0; i < wheelsNum; i++) {
            i = i as WheelIndex;

            this.#vehicle.updateWheelTransform(i, true);
            transform = this.#vehicle.getWheelTransformWS(i);
            pos = transform.getOrigin();
            quart = transform.getRotation();

            const wheelData = this.#wheelStates[i];
            wheelData.mesh.position.set(pos.x(), pos.y(), pos.z());
            wheelData.mesh.quaternion.set(quart.x(), quart.y(), quart.z(), quart.w());
        }

        transform = this.#vehicle.getChassisWorldTransform();
        pos = transform.getOrigin();
        quart = transform.getRotation();
        this.#chassisMesh.position.set(pos.x(), pos.y(), pos.z());
        this.#chassisMesh.quaternion.set(quart.x(), quart.y(), quart.z(), quart.w());
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
    }

    #tickWheelsState(dt: number, wheelsNum: number, vehicle: Ammo.btRaycastVehicle, speed: number): void {
        for (let i = 0; i < wheelsNum; i++) {
            const wheelData = this.#wheelStates[i as WheelIndex];
            switch (wheelData.state) {
                case WheelState.NONE:
                    continue;
                case WheelState.ACCELERATING:
                    vehicle.applyEngineForce(wheelData.options.engineForce, i);
                    break;
                case WheelState.BRAKING:
                    vehicle.setBrake(wheelData.options.brakeForce, i);
                    break;
                case WheelState.REVERSING:
                    vehicle.applyEngineForce(-wheelData.options.engineForce, i);
                    break;
                case WheelState.STEERING_LEFT:
                    wheelData.steeringValue = Math.min(
                        wheelData.steeringValue + wheelData.options.steeringIncrement * dt,
                        wheelData.options.steeringLimit
                    );
                    break;
                case WheelState.STEERING_RIGHT:
                    wheelData.steeringValue = Math.max(
                        wheelData.steeringValue - wheelData.options.steeringIncrement * dt,
                        -wheelData.options.steeringLimit
                    );
                    break;
                default:
                    throw new Error("Invalid wheel state");
            }

            // reset the steering if the state is not steering
            if (wheelData.state !== WheelState.STEERING_LEFT && wheelData.state !== WheelState.STEERING_RIGHT)
                if (wheelData.steeringValue < 0)
                    wheelData.steeringValue = Math.min(
                        wheelData.steeringValue + wheelData.options.steeringIncrement * dt,
                        0
                    );
                else if (wheelData.steeringValue > 0)
                    wheelData.steeringValue = Math.max(
                        wheelData.steeringValue - wheelData.options.steeringIncrement * dt,
                        0
                    );

            vehicle.setSteeringValue(wheelData.steeringValue, i);
        }
    }
}

export { RaycastVehicleEntity };

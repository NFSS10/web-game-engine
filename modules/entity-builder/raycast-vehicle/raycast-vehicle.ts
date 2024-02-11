import * as THREE from "three";
import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Physics, World } from "@src/physics";
import { BodySimulationState } from "@src/physics/enums";
import { type BodyOptions } from "@src/physics/types";
import { ObjectUtils } from "@src/entity/utils";
import { type WheelData, type WheelOptions } from "./types";
import { WheelIndex, SteeringState, MovementState } from "./enums";

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
            engineForce: 2500,
            brakeForce: 75,
            steeringLimit: 0.65,
            steeringIncrement: 1.5,
            isFrontWheel: false,
            radius: 0,
            friction: 1000,
            suspensionStiffness: 15.0,
            suspensionDamping: 0.5,
            suspensionCompression: 10.0,
            suspensionRestLength: 0.1,
            rollInfluence: 0.5
        };
        this.#wheelStates = {} as Record<WheelIndex, WheelData>;
        this.#wheelStates[WheelIndex.FRONT_LEFT] = {
            mesh: leftFrontWheel,
            movementState: MovementState.NONE,
            steeringState: SteeringState.NONE,
            steeringValue: 0,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.FRONT_RIGHT] = {
            mesh: rightFrontWheel,
            movementState: MovementState.NONE,
            steeringState: SteeringState.NONE,
            steeringValue: 0,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.BACK_LEFT] = {
            mesh: leftBackWheel,
            movementState: MovementState.NONE,
            steeringState: SteeringState.NONE,
            steeringValue: 0,
            options: { ...defaultOptions }
        };
        this.#wheelStates[WheelIndex.BACK_RIGHT] = {
            mesh: rightBackWheel,
            movementState: MovementState.NONE,
            steeringState: SteeringState.NONE,
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
        try {
            const wheelInfo = this.#vehicle.getWheelInfo(wheel);
            wheelInfo.set_m_bIsFrontWheel(wheelData.options.isFrontWheel);
            wheelInfo.set_m_wheelsRadius(wheelData.options.radius);
            wheelInfo.set_m_frictionSlip(wheelData.options.friction);
            wheelInfo.set_m_suspensionStiffness(wheelData.options.suspensionStiffness);
            wheelInfo.set_m_wheelsDampingRelaxation(wheelData.options.suspensionDamping);
            wheelInfo.set_m_wheelsDampingCompression(wheelData.options.suspensionCompression);
            wheelInfo.set_m_rollInfluence(wheelData.options.rollInfluence);
        } catch (e) {
            // ignore error if the vehicle is not yet created
        }

        return this;
    }

    setMovementState(wheel: WheelIndex, state: MovementState): void {
        this.#wheelStates[wheel].movementState = state;
    }

    setSteeringState(wheel: WheelIndex, state: SteeringState): void {
        this.#wheelStates[wheel].steeringState = state;
    }

    _createBody(bodyOptions?: BodyOptions): void {
        if (this.bodies.length > 0) return;
        this.#chassisBody = Physics.createBoxBody(this.#chassisMesh, {
            mass: bodyOptions?.mass ?? 1500,
            friction: bodyOptions?.friction ?? 1
        });
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
        if (!this.isPhysicsEnabled) return;

        this.#currentSpeed = this.#vehicle.getCurrentSpeedKmHour();

        const wheelsNum = this.#vehicle.getNumWheels();

        this.#tickWheelsState(dt, wheelsNum, this.#vehicle);

        let transform: Ammo.btTransform, pos: Ammo.btVector3, quat: Ammo.btQuaternion, i: WheelIndex;
        for (i = 0; i < wheelsNum; i++) {
            i = i as WheelIndex;

            this.#vehicle.updateWheelTransform(i, true);
            transform = this.#vehicle.getWheelTransformWS(i);
            pos = transform.getOrigin();
            quat = transform.getRotation();

            // convert world position to local position
            const position = new THREE.Vector3(pos.x(), pos.y(), pos.z());
            this.object.worldToLocal(position);

            // convert world rotation to local rotation
            const quaternion = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());
            const inverseQuat = this.object.quaternion.clone().invert();
            quaternion.premultiply(inverseQuat);

            // update the wheel mesh position and rotation
            const wheelData = this.#wheelStates[i];
            wheelData.mesh.position.copy(position);
            wheelData.mesh.quaternion.copy(quaternion);
        }

        transform = this.#vehicle.getChassisWorldTransform();
        pos = transform.getOrigin();
        quat = transform.getRotation();
        this.object.position.set(pos.x(), pos.y(), pos.z());
        this.object.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w());
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

    #tickWheelsState(dt: number, wheelsNum: number, vehicle: Ammo.btRaycastVehicle): void {
        for (let i = 0; i < wheelsNum; i++) {
            const wheelData = this.#wheelStates[i as WheelIndex];

            // update the movement
            switch (wheelData.movementState) {
                case MovementState.NONE:
                    vehicle.setBrake(0, i);
                    vehicle.applyEngineForce(0, i);
                    break;
                case MovementState.ACCELERATING:
                    this.#chassisBody.setActivationState(BodySimulationState.ACTIVE);
                    vehicle.setBrake(0, i);
                    vehicle.applyEngineForce(wheelData.options.engineForce, i);
                    break;
                case MovementState.BRAKING:
                    this.#chassisBody.setActivationState(BodySimulationState.ACTIVE);
                    vehicle.applyEngineForce(0, i);
                    vehicle.setBrake(wheelData.options.brakeForce, i);
                    break;
                case MovementState.REVERSING:
                    this.#chassisBody.setActivationState(BodySimulationState.ACTIVE);
                    vehicle.setBrake(0, i);
                    vehicle.applyEngineForce(-wheelData.options.engineForce, i);
                    break;
                default:
                    throw new Error("Invalid movement state");
            }

            // update the steering
            switch (wheelData.steeringState) {
                case SteeringState.LEFT:
                    wheelData.steeringValue = Math.min(
                        wheelData.steeringValue + wheelData.options.steeringIncrement * dt,
                        wheelData.options.steeringLimit
                    );
                    break;
                case SteeringState.RIGHT:
                    wheelData.steeringValue = Math.max(
                        wheelData.steeringValue - wheelData.options.steeringIncrement * dt,
                        -wheelData.options.steeringLimit
                    );
                    break;
                case SteeringState.NONE:
                    // reset the steering if the state is not steering
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
                    break;
                default:
                    throw new Error("Invalid steering state");
            }

            vehicle.setSteeringValue(wheelData.steeringValue, i);
        }
    }
}

export { RaycastVehicleEntity };

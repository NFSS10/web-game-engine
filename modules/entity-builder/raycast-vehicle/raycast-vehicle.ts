import * as THREE from "three";
import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Physics, World } from "@src/physics";
import { ObjectUtils } from "@src/entity/utils";

class RaycastVehicleEntity extends Entity {
    #chassisMesh: THREE.Object3D;
    #wheelsMeshes: THREE.Object3D[] = [];
    #chassisBody: Ammo.btRigidBody;
    #vehicle: Ammo.btRaycastVehicle;

    constructor(
        chassis: THREE.Object3D,
        leftFrontWheel: THREE.Object3D,
        rightFrontWheel: THREE.Object3D,
        leftBackWheel: THREE.Object3D,
        rightBackWheel: THREE.Object3D,
        options?: EntityOptions
    ) { 
        const car = new THREE.Object3D();
        car.add(chassis);
        car.add(leftFrontWheel);
        car.add(rightFrontWheel);
        car.add(leftBackWheel);
        car.add(rightBackWheel);

        super(car);
        this.#chassisMesh = chassis;
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

        this.#createWheels(this.#vehicle, tuning);
    }

    tickBodies(): void {
        const speed = this.#vehicle.getCurrentSpeedKmHour();
        console.log("speed", speed); // TODO: expose this

        const engineForce = 0.5; // TODO: support customizing engine force
        this.#vehicle.applyEngineForce(engineForce, 2); // 2 === idx for right back wheel
        this.#vehicle.applyEngineForce(engineForce, 3); // 3 === idx for right back wheel

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

    #createWheels(vehicle: Ammo.btRaycastVehicle, tuning: Ammo.btVehicleTuning): void {
        // TODO: support custom wheel options
        const friction = 1000;
        const suspensionStiffness = 15.0;
        const suspensionDamping = 0.5;
        const suspensionCompression = 5.0;
        const suspensionRestLength = 0.5;
        const rollInfluence = 0.5;

        const createWheelMesh = (): THREE.Mesh => {
            const geo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
            const material = new THREE.MeshNormalMaterial();
            const mesh = new THREE.Mesh(geo, material);
            return mesh;
        };

        // right front wheel
        const rightFrontMesh = createWheelMesh();
        rightFrontMesh.position.set(1, -0.5, 1);
        rightFrontMesh.rotation.y = Math.PI / 6;
        this.#createWheel(
            vehicle,
            tuning,
            rightFrontMesh,
            true,
            friction,
            suspensionStiffness,
            suspensionDamping,
            suspensionCompression,
            suspensionRestLength,
            rollInfluence
        );
        this.object.add(rightFrontMesh);
        this.#wheelsMeshes.push(rightFrontMesh);

        // left front wheel
        const leftFrontMesh = createWheelMesh();
        leftFrontMesh.position.set(-1, -0.5, 1);
        leftFrontMesh.rotation.y = Math.PI / 6;
        this.#createWheel(
            vehicle,
            tuning,
            leftFrontMesh,
            true,
            friction,
            suspensionStiffness,
            suspensionDamping,
            suspensionCompression,
            suspensionRestLength,
            rollInfluence
        );
        this.object.add(leftFrontMesh);
        this.#wheelsMeshes.push(leftFrontMesh);

        // right back wheel
        const rightBackMesh = createWheelMesh();
        rightBackMesh.position.set(1, -0.5, -2);
        rightBackMesh.rotation.y = Math.PI / 6;
        this.#createWheel(
            vehicle,
            tuning,
            rightBackMesh,
            false,
            friction,
            suspensionStiffness,
            suspensionDamping,
            suspensionCompression,
            suspensionRestLength,
            rollInfluence
        );
        this.object.add(rightBackMesh);
        this.#wheelsMeshes.push(rightBackMesh);

        // left back wheel
        const leftBackMesh = createWheelMesh();
        leftBackMesh.position.set(-1, -0.5, -2);
        leftBackMesh.rotation.y = Math.PI / 6;
        this.#createWheel(
            vehicle,
            tuning,
            leftBackMesh,
            false,
            friction,
            suspensionStiffness,
            suspensionDamping,
            suspensionCompression,
            suspensionRestLength,
            rollInfluence
        );
        this.object.add(leftBackMesh);
        this.#wheelsMeshes.push(leftBackMesh);
    }

    #createWheel(
        vehicle: Ammo.btRaycastVehicle,
        tuning: Ammo.btVehicleTuning,
        object: THREE.Object3D,
        isFrontWheel: boolean,
        friction: number,
        suspensionStiffness: number,
        suspensionDamping: number,
        suspensionCompression: number,
        suspensionRestLength: number,
        rollInfluence: number
    ): void {
        // wheels direction and axle setup
        const wheelDirectionCS0 = new Physics.Ammo.btVector3(0, -1, 0);
        const wheelAxleCS = new Physics.Ammo.btVector3(-1, 0, 0);

        const position = new Physics.Ammo.btVector3(object.position.x, object.position.y, object.position.z);

        // TODO accept radius as parameter
        let radius: number;

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

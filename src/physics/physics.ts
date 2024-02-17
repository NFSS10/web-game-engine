import * as THREE from "three";
import { type Ammo } from "ammo";

import { ObjectUtils } from "@src/entity/utils";
import { type Body, type BodyOptions } from "./types";
import { BodySimulationState, BodyType, CollisionFlag } from "./enums";

abstract class Physics {
    static #Ammo?: Ammo;

    static async init(): Promise<void> {
        const module = await import("https://cdn-static-nfss10.netlify.app/libs/ammo.js/ammo.js");
        const lib = module.default;
        this.#Ammo = (await lib()) as Ammo;
    }

    static get Ammo(): Ammo {
        if (!Physics.#Ammo) throw new Error("Physics engine not loaded");
        return Physics.#Ammo;
    }

    static generateDynamicWorld(gravity?: number): Ammo.btDiscreteDynamicsWorld {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        gravity = gravity ?? -9.82;

        const collisionConfiguration = new this.#Ammo.btDefaultCollisionConfiguration();
        const dispatcher = new this.#Ammo.btCollisionDispatcher(collisionConfiguration);
        const broadphase = new this.#Ammo.btDbvtBroadphase();
        const solver = new this.#Ammo.btSequentialImpulseConstraintSolver();

        const physicsWorld = new this.#Ammo.btDiscreteDynamicsWorld(
            dispatcher,
            broadphase,
            solver,
            collisionConfiguration
        );
        physicsWorld.setGravity(new this.#Ammo.btVector3(0, gravity, 0));

        return physicsWorld;
    }

    static createBoxBody(object: THREE.Object3D, options?: BodyOptions): Body {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        const size = ObjectUtils.getBoundingBoxSize(object);

        const halfExtents = new this.#Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
        const shape = new this.#Ammo.btBoxShape(halfExtents);
        return this.#createBody(shape, object, options);
    }

    static createSphereBody(radius: number, object: THREE.Object3D, options?: BodyOptions): Body {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        const shape = new this.#Ammo.btSphereShape(radius);
        return this.#createBody(shape, object, options);
    }

    static createCylinderBody(radius: number, height: number, object: THREE.Object3D, options?: BodyOptions): Body {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        const halfExtents = new this.#Ammo.btVector3(radius, height * 0.5, radius);
        const shape = new this.#Ammo.btCylinderShape(halfExtents);
        return this.#createBody(shape, object, options);
    }

    static createConeBody(radius: number, height: number, object: THREE.Object3D, options?: BodyOptions): Body {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        const shape = new this.#Ammo.btConeShape(radius, height);
        return this.#createBody(shape, object, options);
    }

    static createCapsuleBody(radius: number, height: number, object: THREE.Object3D, options?: BodyOptions): Body {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        const shape = new this.#Ammo.btCapsuleShape(radius, height);
        return this.#createBody(shape, object, options);
    }

    static #createBody(shape: Ammo.btCollisionShape, object: THREE.Object3D, options?: BodyOptions): Body {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        let mass = options?.mass ?? 1;
        const friction = options?.friction ?? 1;
        const bodyType = options?.type ?? BodyType.DYNAMIC;

        if (bodyType === BodyType.KINEMATIC && mass != 0) {
            console.warn("Kinematic bodies should have 0 mass. Setting mass to 0.");
            mass = 0;
        } else if (bodyType === BodyType.STATIC && mass != 0) {
            console.warn("Static bodies should have 0 mass. Setting mass to 0.");
            mass = 0;
        }

        // calculates inertia
        const localInertia = new this.#Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);

        // rigid body initial transform
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        object.getWorldPosition(worldPos);
        object.getWorldQuaternion(worldQuat);

        const transform = new this.#Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.#Ammo.btVector3(worldPos.x, worldPos.y, worldPos.z));
        transform.setRotation(new this.#Ammo.btQuaternion(worldQuat.x, worldQuat.y, worldQuat.z, worldQuat.w));
        const motionState = new this.#Ammo.btDefaultMotionState(transform);

        // create rigid body
        const rigidBodyInfo = new this.#Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const rigidBody = new this.#Ammo.btRigidBody(rigidBodyInfo);

        rigidBody.setFriction(friction);

        // set collision flags
        const collisionFlags =
            bodyType === BodyType.KINEMATIC
                ? rigidBody.getCollisionFlags() | CollisionFlag.CF_KINEMATIC_OBJECT
                : rigidBody.getCollisionFlags();
        rigidBody.setCollisionFlags(collisionFlags);

        // set activation state
        const activeState =
            bodyType === BodyType.KINEMATIC ? BodySimulationState.ALWAYS_ACTIVE : BodySimulationState.ACTIVE;
        rigidBody.setActivationState(activeState);

        return rigidBody;
    }
}

export { Physics };

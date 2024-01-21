import * as THREE from "three";
import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { type World, type Body, type BodyOptions } from "./types";
import { BodySimulationState } from "./enums";

abstract class Physics {
    static #Ammo?: Ammo;

    static auxTransform: Ammo.btTransform;

    static async init(): Promise<void> {
        const module = await import("https://cdn-static-nfss10.netlify.app/libs/ammo.js/ammo.js");
        const lib = module.default;
        this.#Ammo = (await lib()) as Ammo;

        this.auxTransform = new this.#Ammo.btTransform();
    }

    static createWorld(gravity?: number): World {
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

    static createBody(object: THREE.Object3D, options?: BodyOptions): Body {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        const size = this.#getBoundingBoxSize(object);

        const mass = options?.mass ?? 1;
        const friction = options?.friction ?? 1;

        // creates the physical body shape
        const halfExtents = new this.#Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
        const shape = new this.#Ammo.btBoxShape(halfExtents);

        // calculates inertia
        const localInertia = new this.#Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);

        // rigid body initial transform
        const transform = new this.#Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.#Ammo.btVector3(object.position.x, object.position.y, object.position.z));
        transform.setRotation(
            new this.#Ammo.btQuaternion(
                object.quaternion.x,
                object.quaternion.y,
                object.quaternion.z,
                object.quaternion.w
            )
        );
        const motionState = new this.#Ammo.btDefaultMotionState(transform);

        // create rigid body
        const rigidBodyInfo = new this.#Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const rigidBody = new this.#Ammo.btRigidBody(rigidBodyInfo);

        rigidBody.setFriction(friction);

        rigidBody.setActivationState(BodySimulationState.ACTIVE);

        // create a unique ID
        const randomNumber = Math.floor(Math.random() * 100000000);
        const idStr = `${Date.now()}${randomNumber}`.slice(4);
        const id = parseInt(idStr);
        rigidBody.setUserPointer(id);

        return rigidBody;
    }

    static tickWorld(world: World, entities: Entity[], dt: number): void {
        if (!this.#Ammo) throw new Error("Physics engine not loaded");

        world.stepSimulation(dt, 10);

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i] as Entity;
            entity.tickBodies();
        }
    }
}

export { Physics };

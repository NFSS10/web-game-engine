import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { Physics } from "./physics";
import { type Body } from "./types";

class World {
    #gravity: number;
    #entities: Entity[];
    #bodies: Body[];
    #physicsWorld: Ammo.btDiscreteDynamicsWorld;
 
    constructor(gravity?: number) {
        this.#gravity = gravity ?? -9.82;
        this.#entities = [];
        this.#bodies = [];

        this.#physicsWorld = Physics.generateDynamicWorld(this.#gravity);
    }

    get gravity(): number {
        return this.#gravity;
    }

    get entities(): Entity[] {
        return this.#entities;
    }

    get bodies(): Body[] {
        return this.#bodies;
    }

    tick(dt: number): void {
        this.#physicsWorld.stepSimulation(dt, 10);

        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i] as Entity;
            entity.tickBodies();
        }
    }

    addEntity(entity: Entity): void {
        const foundEntity = this.#entities.find(e => e.id === entity.id);
        
        // if the entity is not yet added to the world, simply add it
        if (!foundEntity) {
            this.#entities.push(entity);
            entity.bodies.forEach(body => this.#physicsWorld.addRigidBody(body));
            return;
        }
        
        // otherwise we need to check if our entity contains new bodies
        // that need to be added to the world
        for (let i = 0; i < entity.bodies.length; i++) {
            const body = entity.bodies[i] as Body;
            
            // check if the body is already present in the world
            let isBodyAlreadyAdded = false;
            for (let j = 0; j < this.#bodies.length; j++) {
                const worldBody = this.#bodies[j] as Body;
                isBodyAlreadyAdded = worldBody.getUserPointer() === body.getUserPointer();
                if (isBodyAlreadyAdded) break;
            }

            // the body is not present in the world, so we add it
            if (!isBodyAlreadyAdded) {
                this.#bodies.push(body);
                this.#physicsWorld.addRigidBody(body);
            }
        }
    }

    removeEntity(entity: Entity): void {
        entity.bodies.forEach(body => this.#removeBodyFromWorld(body));
    }

    #removeBodyFromWorld(body: Body): void {
        const contactBodies: Body[] = [];

        // get all bodies that were in contact with the removed body
        const numManifolds = this.#physicsWorld.getDispatcher().getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const contactManifold = this.#physicsWorld.getDispatcher().getManifoldByIndexInternal(i);
            const body0 = contactManifold.getBody0() as Body;
            const body1 = contactManifold.getBody1() as Body;

            // register bodies that were in contact with the removed body
            if (body0.getUserPointer() !== body.getUserPointer()) contactBodies.push(body0);
            if (body1.getUserPointer() !== body.getUserPointer()) contactBodies.push(body1);
        }

        // awake all contact bodies so they can react to the removed body
        for (let i = 0; i < contactBodies.length; i++) {
            const contactBody = contactBodies[i] as Body;
            contactBody.activate(true);
        }

        // remove the body from the world
        this.#physicsWorld.removeRigidBody(body);
        this.#unregisterBody(body);
    }

    #unregisterBody(body: Body): void {
        const index = this.#bodies.findIndex(b => b.getUserPointer() === body.getUserPointer());
        this.#bodies.splice(index, 1);
    }
}

export { World };

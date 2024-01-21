import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { Physics } from "./physics";
import { type Body } from "./types";

class World {
    #gravity: number;
    #entities: Entity[];
    #physicsWorld: Ammo.btDiscreteDynamicsWorld;
 
    constructor(gravity?: number) {
        this.#gravity = gravity ?? -9.82;
        this.#entities = [];

        this.#physicsWorld = Physics.generateDynamicWorld(this.#gravity);
    }

    get gravity(): number {
        return this.#gravity;
    }

    get entities(): Entity[] {
        return this.#entities;
    }

    tick(dt: number): void {
        this.#physicsWorld.stepSimulation(dt, 10);

        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i] as Entity;
            entity.tickBodies();
        }
    }

    addEntity(entity: Entity): void {
        // avoid adding the same entity twice
        if (this.#entities.find(e => e.id === entity.id)) return;

        this.#entities.push(entity);
        entity.bodies.forEach(body => this.#physicsWorld.addRigidBody(body));
    }

    removeEntity(entity: Entity): void {
        entity.bodies.forEach(body => this.#removeFromWorld(body));
    }

    #removeFromWorld(body: Body): void {
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
    }
}

export { World };

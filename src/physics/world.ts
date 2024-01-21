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
            entity.bodies.forEach(body => {
                this.#bodies.push(body);
                this.#physicsWorld.addRigidBody(body)
            });
            return;
        }
        
        // otherwise we need to check if our entity contains new bodies
        // that need to be added to the world
        for (let i = 0; i < entity.bodies.length; i++) {
            const body = entity.bodies[i] as Body;
            
            // check if the body is already present in the world
            let isBodyAlreadyAdded = false;
            for (let j = 0; j < this.#bodies.length; j++) {
                const worldBody = this.#bodies[j]!;
                isBodyAlreadyAdded = worldBody === body;
                if (isBodyAlreadyAdded) {
                    break;
                }
            }

            // the body is not present in the world, so we add it
            if (!isBodyAlreadyAdded) {
                this.#bodies.push(body);
                this.#physicsWorld.addRigidBody(body);
            }
        }
    }

    removeEntity(entity: Entity): void {
        // remove the entity's bodies from the world
        entity.bodies.forEach(body => this.#removeBodyFromWorld(body));
        
        // remove the entity from the world
        const index = this.#entities.findIndex(e => e.id === entity.id);
        this.#entities.splice(index, 1);
    }

    #removeBodyFromWorld(body: Body): void {
        // awake surrounding bodies so they can react to the removed body
        this.#activateSurroundingBodies(body);

        // remove the body from the world
        this.#physicsWorld.removeRigidBody(body);

        // remove the body from the world's registry
        const index = this.#bodies.findIndex(b => b === body);
        this.#bodies.splice(index, 1);
    }

    #activateSurroundingBodies(body: Body): void {
        // iterate over all contact manifolds to find the bodies that were in contact with the removed body
        const numManifolds = this.#physicsWorld.getDispatcher().getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const contactManifold = this.#physicsWorld.getDispatcher().getManifoldByIndexInternal(i);

            // get the bodies involved in the contact
            const body0 = Physics.Ammo.btRigidBody.prototype.upcast(contactManifold.getBody0());
            const body1 = Physics.Ammo.btRigidBody.prototype.upcast(contactManifold.getBody1());

            // check if the body is involved in the contact, if yes then wake them up so they can react to the removed body
            if (body0 === body || body1 === body) {
                body0.activate(true);
                body1.activate(true);
            }
        }
    }
}

export { World };

import * as THREE from "three";

import { Entity } from "@src/entity";
import { Physics, type World, type Body } from "@src/physics";

class Scene {
    #id: string;
    #entities: Entity[] = [];
    #scene: THREE.Scene;
    #world: World;
    #timeScale = 1;

    constructor(id: string) {
        this.#id = id;
        this.#scene = new THREE.Scene();
        this.#world = Physics.createWorld();
    }

    get id(): string {
        return this.#id;
    }

    get scene(): THREE.Scene {
        return this.#scene;
    }

    addEntity(entity: Entity): Scene {
        this.#entities.push(entity);
        this.#scene.add(entity.object);
        if (entity.body) this.#world.addRigidBody(entity.body);
        return this;
    }

    removeEntity(id: string): void {
        const index = this.#entities.findIndex(entity => entity.id === id);
        if (index === -1) return;

        const entity = this.#entities[index] as Entity;

        if (entity.body) this.#removeFromWorld(entity.body);
        this.#scene.remove(entity.object);

        // destroys the entity
        entity.destroy();
        this.#entities.splice(index, 1);
    }

    tickPhysics(dt: number): void {
        dt = dt * this.#timeScale;
        Physics.tickWorld(this.#world, this.#entities, dt);
    }

    destroy(): void {
        this.#entities.forEach(entity => entity.destroy());
        this.#entities = [];
    }

    #removeFromWorld(body: Body): void {
        const contactBodies: Body[] = [];

        // get all bodies that were in contact with the removed body
        const numManifolds = this.#world.getDispatcher().getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const contactManifold = this.#world.getDispatcher().getManifoldByIndexInternal(i);
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
        this.#world.removeRigidBody(body);
    }
}

export { Scene };

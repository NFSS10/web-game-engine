import * as THREE from "three";

import { Entity } from "@src/entity";
import { World } from "@src/physics";

class Scene {
    #id: string;
    #entities: Entity[] = [];
    #scene: THREE.Scene;
    #world: World;
    #timeScale = 1;

    constructor(id: string) {
        this.#id = id;
        this.#scene = new THREE.Scene();
        this.#world = new World();
    }

    get id(): string {
        return this.#id;
    }

    get scene(): THREE.Scene {
        return this.#scene;
    }

    addEntity(entity: Entity): Scene {
        // avoid adding the same entity twice
        if (this.#entities.find(e => e.id === entity.id)) return this;
     
        entity.sceneRef = this;
        this.#entities.push(entity);
        this.#scene.add(entity.object);
        this.#world.addEntity(entity);
        this.addEntityToWorld(entity);

        return this;
    }

    addEntityToWorld(entity: Entity): void {
        this.#world.addEntity(entity);
    }

    removeEntity(id: string): void {
        const index = this.#entities.findIndex(entity => entity.id === id);
        if (index === -1) return;

        const entity = this.#entities[index] as Entity;

        this.removeEntityFromWorld(entity);
        this.#scene.remove(entity.object);
        this.#entities.splice(index, 1);
    }

    removeEntityFromWorld(entity: Entity): void {
        this.#world.removeEntity(entity);
    }

    tickPhysics(dt: number): void {
        dt = dt * this.#timeScale;
        this.#world.tick(dt);
    }

    destroy(): void {
        this.#entities.forEach(entity => entity.destroy());
        this.#entities = [];
    }
}

export { Scene };

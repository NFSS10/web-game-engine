import * as THREE from "three";

import { Entity } from "@src/entity";
import { Physics, type World } from "@src/physics";

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

    destroy(): void {
        this.#entities.forEach(entity => entity.destroy());
        this.#entities = [];
    }
}

export { Scene };

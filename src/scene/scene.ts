import * as THREE from "three";

import { Entity } from "@src/entity";

class Scene {
    #id: string;
    #entities: Entity[] = [];
    #scene: THREE.Scene;

    constructor(id: string) {
        this.#id = id;
        this.#scene = new THREE.Scene();
    }

    get id(): string {
        return this.#id;
    }

    get scene(): THREE.Scene {
        return this.#scene;
    }

    addEntity(entity: Entity): Scene {
        this.#entities.push(entity);
        return this;
    }

    destroy(): void {
        this.#entities.forEach(entity => entity.destroy());
        this.#entities = [];
    }
}

export { Scene };

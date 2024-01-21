import * as THREE from "three";

import { Physics } from "@src/physics";
import { type Body, type BodyOptions } from "@src/physics/types";
import { Scene } from "@src/scene";
import { Utils } from "@src/utils";
import { type EntityOptions } from "./types";

class Entity {
    #id: string;
    #object: THREE.Object3D;
    #bodies: Body[];
    #isPhysicsEnabled: boolean;

    sceneRef?: Scene;

    constructor(object: THREE.Object3D, options?: EntityOptions) {
        this.#id = options?.id ?? Utils.generateUUID();
        this.#object = object;
        this.#bodies = [];
        this.#isPhysicsEnabled = false;
    }

    get id(): string {
        return this.#id;
    }

    get object(): THREE.Object3D {
        return this.#object;
    }

    get bodies(): Body[] {
        return this.#bodies;
    }

    get isPhysicsEnabled(): boolean {
        // TODO: handle this flag. Entities with disabled physics should not affect the physics world
        return this.#isPhysicsEnabled;
    }

    enablePhysics(bodyOptions?: BodyOptions): Entity {
        // the default behavior is to create a box body around the object
        // if no bodies were yet created for this entity
        if (this.#bodies.length === 0) this._createBody(bodyOptions);

        // if the entity is already in a scene, register it in the physics world
        if (this.sceneRef) this.sceneRef.addEntityToWorld(this);

        this.#isPhysicsEnabled = true;
        return this;
    }

    disablePhysics(): Entity {
        // if the entity is already in a scene, unregister it from the physics world
        if (this.sceneRef) this.sceneRef.removeEntityFromWorld(this);

        this.#isPhysicsEnabled = false;
        return this;
    }

    destroy(): void {
        // remove references before destroying
        if (this.sceneRef) {
            this.sceneRef.removeEntity(this.#id);
            this.sceneRef = undefined;
        }

        this.#bodies.forEach(body => Physics.Ammo.destroy(body));
        this.#bodies.length = 0;

        // @ts-expect-error Ensure this is destroyed
        this.#object = null; // TODO: fully dispose the object

        // @ts-expect-error Ensure this is destroyed
        this.#id = null;
    }

    tickBodies(): void {
        throw new Error("Method not implemented");
    }

    _createBody(options?: BodyOptions): void {
        if (this.bodies.length > 0) return;

        console.info(`Generating default body for entity: "${this.#id}"`);
        const body = Physics.createBody(this.#object, options);
        this.#bodies.push(body);
    }
}

export { Entity };

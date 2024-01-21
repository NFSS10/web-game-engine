import * as THREE from "three";

import { Physics } from "@src/physics";
import { type Body } from "@src/physics/types";
import { Scene } from "@src/scene";
import { Utils } from "@src/utils";
import {type EntityOptions } from "./types";

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

    enablePhysics(): Entity {
        // the default behavior is to create a box body around the object
        // if no bodies were yet created for this entity
        if (this.#bodies.length === 0) this.#generateDefaultBody();

        // if the entity is already in a scene, register it in the physics world
        if (this.sceneRef) this.sceneRef.addEntityToWorld(this);

        this.#isPhysicsEnabled = true;
        return this;
    }

    disablePhysics(): Entity {
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

        // @ts-expect-error
        this.#object = null; // TODO: fully dispose the object
        
        // @ts-expect-error
        this.#id = null;
    }

    tickBodies(): void {
        throw new Error("Method not implemented");
    }

    #generateDefaultBody(): void {
        console.info("Generating default body for entity", this.#id)
        const body =  Physics.createBody(this.#object, { mass: 1, friction: 1});
        this.#bodies.push(body);
    }
}

export { Entity };

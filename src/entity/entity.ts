import * as THREE from "three";

import { type Size } from "@src/types";
import { Physics, World } from "@src/physics";
import { type Body } from "@src/physics/types";
import { Scene } from "@src/scene";
import { Utils } from "@src/utils";
import { type CreateBodyOptions, type EntityOptions } from "./types";
import { ObjectUtils } from "./utils";
import { Animator } from "./animator";

class Entity {
    #id: string;
    #object: THREE.Object3D;
    #size: Size;
    #bodies: Body[];
    #isPhysicsEnabled: boolean;

    #animator: Animator;

    sceneRef?: Scene;

    constructor(object: THREE.Object3D, options?: EntityOptions) {
        this.#id = options?.id ?? Utils.generateUUID();
        this.#object = object;
        this.#size = { x: -1, y: -1, z: -1 };
        this.#bodies = [];
        this.#isPhysicsEnabled = false;

        this.#animator = new Animator(this.#object);
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

    get size(): Size {
        return this.#size;
    }

    get isPhysicsEnabled(): boolean {
        return this.#isPhysicsEnabled;
    }

    get Animator(): Animator {
        return this.#animator;
    }

    enablePhysics(options?: CreateBodyOptions): Entity {
        // the default behavior is to create a box body around the object
        // if no bodies were yet created for this entity
        if (this.#bodies.length === 0) {
            const size = options?.size ?? ObjectUtils.getBoundingBoxSize(this.object);
            this.#size = size;
            this._createBody(options);
        }

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

    tick(dt: number): void {
        // update animations
        this.#animator.tick(dt);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tickBodies(dt: number): void {
        throw new Error("Method not implemented");
    }

    _createBody(options?: CreateBodyOptions): void {
        if (this.bodies.length > 0) return;

        const size = options?.size ?? this.#size;
        const body = Physics.createBoxBody(size, this.#object, options);
        this.#bodies.push(body);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onAddToWorld(world: World): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onRemoveFromWorld(world: World): void {}
}

export { Entity };

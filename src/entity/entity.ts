import * as THREE from "three";

import { type Body } from "@src/physics";
import {type EntityOptions } from "./types";

class Entity {
    #id: string;
    #object: THREE.Object3D;
    #bodies: Body[];
    #isPhysicsEnabled: boolean;

    constructor(object: THREE.Object3D, options?: EntityOptions) {
        this.#id = options?.id ?? THREE.MathUtils.generateUUID();
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
        return this.#isPhysicsEnabled;
    }

    enablePhysics(): Entity {
        this.#isPhysicsEnabled = true;
        return this;
    }

    disablePhysics(): Entity {
        this.#isPhysicsEnabled = false;
        return this;
    }

    tickBodies(): void {
        throw new Error("Method not implemented");
    }

    destroy(): void {
        throw new Error("Method not implemented");
    }
}

export { Entity };

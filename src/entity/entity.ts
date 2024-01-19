import { Physics, type Body, type BodyOptions } from "@src/physics";

class Entity {
    #id: string;
    #object: THREE.Object3D;
    #body?: Body;

    constructor(id: string, object: THREE.Object3D) {
        this.#id = id;
        this.#object = object;
    }

    get id(): string {
        return this.#id;
    }

    get object(): THREE.Object3D {
        return this.#object;
    }

    get body(): Body | undefined {
        return this.#body;
    }

    enablePhysics(options?: BodyOptions): Entity {
        this.#body = Physics.createBody(this.#object, options);
        return this;
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

export { Entity };

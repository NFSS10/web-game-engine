import { Physics, type Body } from "@src/physics";

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

    enablePhysics(): Entity {
        this.#body = Physics.createBody(this.#object);
        return this;
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

export { Entity };

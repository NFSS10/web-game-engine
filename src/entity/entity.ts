type PhysicsBody = any; // TODO improve types

class Entity {
    #id: string;
    #object: THREE.Object3D;
    #body?: PhysicsBody;

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

    get body(): PhysicsBody | undefined {
        return this.#body;
    }

    enablePhysics(): Entity {
        // TODO:
        return this;
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

export { Entity };

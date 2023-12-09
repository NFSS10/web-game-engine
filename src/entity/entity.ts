class Entity {
    #id: string;
    #object: THREE.Object3D;

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

    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

export { Entity };

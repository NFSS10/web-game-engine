import * as THREE from "three";

import { Module } from "@modules";
import { Entity } from "@src/entity";
import { PrimitiveType } from "./types";

class EntityBuilder extends Module {
    constructor() {
        super();
    }

    get supportedPrimitives(): string[] {
        return Object.values(PrimitiveType);
    }

    createPrimitive(type: PrimitiveType, id: string): Entity {
        switch (type) {
            case PrimitiveType.Cube:
                return this.#createCube(id);
            default:
                throw new Error(`Unsupported primitive type: ${type}`);
        }
    }

    #createCube(id: string): Entity {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        const entity = new Entity(id, mesh);
        return entity;
    }
}

export { EntityBuilder };

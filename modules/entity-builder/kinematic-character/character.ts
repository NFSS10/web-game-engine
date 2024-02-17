import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { KinematicCharacterEntity } from "./kinematic-character";

class Character extends KinematicCharacterEntity {
    constructor(mesh: THREE.Object3D, options?: EntityOptions) {
        super(mesh, options);
    }
}

export { Character };

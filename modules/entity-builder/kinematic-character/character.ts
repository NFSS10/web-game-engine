import * as THREE from "three";

import { type EntityOptions } from "@src/entity/types";
import { KinematicCharacterEntity } from "./kinematic-character";

// TODO: improve character capabilities
// - improve movement, animations, etc

class Character extends KinematicCharacterEntity {
    constructor(mesh: THREE.Object3D, options?: EntityOptions) {
        super(mesh, options);
    }

    moveX(value: number): void {
        this.Animator.play("walking");
        this.Animator.stop("idle");
        super.moveX(value);
    }

    moveZ(value: number): void {
        this.Animator.play("walking");
        this.Animator.stop("idle");
        super.moveZ(value);
    }

    stop(): void {
        this.Animator.stop("walking");
        this.Animator.play("idle");
        super.moveX(0);
        super.moveZ(0);
    }

    dance(): void {
        this.Animator.play("dancing");
    }
}

export { Character };

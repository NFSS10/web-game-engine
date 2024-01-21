import * as THREE from "three";
import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Physics } from "@src/physics";
import { type Body } from "@src/physics/types";

class PrimitiveEntity extends Entity {
    #auxTransform: Ammo.btTransform;

    constructor(object: THREE.Object3D, options?: EntityOptions) {
        super(object, options);

        this.#auxTransform = new Physics.Ammo.btTransform();   
    }

    tickBodies(): void {
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as Body;
            
            const ms = body.getMotionState();
            if (!ms) continue;

            ms.getWorldTransform(this.#auxTransform);
            const position = this.#auxTransform.getOrigin();
            const quaternion = this.#auxTransform.getRotation();

            const mesh = this.object;
            mesh.position.set(position.x(), position.y(), position.z());
            mesh.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());
        }
    }

    destroy(): void {
        super.destroy();

        Physics.Ammo.destroy(this.#auxTransform);
        // @ts-expect-error
        this.#auxTransform = null;
    }
}

export { PrimitiveEntity };

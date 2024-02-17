import { type Ammo } from "ammo";

import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Physics } from "@src/physics";
import { type BodyOptions } from "@src/physics/types";
import { BodyType } from "@src/physics/enums";

class KinematicCharacterEntity extends Entity {
    #auxTransform: Ammo.btTransform;
    #fallVelocity: number;
    #moveX: number;
    #moveY: number;
    #moveZ: number;

    constructor(object: THREE.Object3D, options?: EntityOptions) {
        super(object, options);

        this.#auxTransform = new Physics.Ammo.btTransform();
        this.#fallVelocity = 0;
        this.#moveX = 0;
        this.#moveY = 0;
        this.#moveZ = 0;
    }

    get isFalling(): boolean {
        return this.#fallVelocity > 0;
    }

    moveX(value: number): void {
        this.#moveX = value;
    }

    moveY(value: number): void {
        this.#moveY = value;
    }

    moveZ(value: number): void {
        this.#moveZ = value;
    }

    _createBody(options?: BodyOptions): void {
        if (this.bodies.length > 0) return;

        // TODO: Calculate size of the object and pass down to the function
        // TODO: Change default body to a capsule
        const body = Physics.createBoxBody(this.object, {
            friction: options?.friction ?? 1,
            mass: 0,
            type: BodyType.KINEMATIC
        });
        this.bodies.push(body);
    }

    tickBodies(dt: number): void {
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i]!;

            const ms = body.getMotionState();
            if (!ms) continue;

            ms.getWorldTransform(this.#auxTransform);
            const position = this.#auxTransform.getOrigin();
            const quaternion = this.#auxTransform.getRotation();

            // simulate gravity manually
            this.#simulateFalling(dt, position);

            // move the object based on the input
            position.setX(position.x() + this.#moveX * dt);
            position.setY(position.y() + this.#moveY * dt);
            position.setZ(position.z() + this.#moveZ * dt);

            // updates the transform of the motion state
            this.#auxTransform.setOrigin(position);
            ms.setWorldTransform(this.#auxTransform);

            const mesh = this.object;
            mesh.position.set(position.x(), position.y(), position.z());
            mesh.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());
        }
    }

    #simulateFalling(dt: number, position: Ammo.btVector3): void {
        const sizeY = 1; // TODO: don't use hardcoded values

        // raycast directly down from the object's position to check if there is a surface below it
        // the 0.0025 is a small error margin to ensure the raycast doesn't miss the surface
        const from = new Physics.Ammo.btVector3(position.x(), position.y(), position.z());
        const to = new Physics.Ammo.btVector3(position.x(), position.y() - (sizeY + 0.0025), position.z());
        const rayCallback = new Physics.Ammo.ClosestRayResultCallback(from, to);
        this.sceneRef?.world.physicsWorld.rayTest(from, to, rayCallback);

        // if there is a surface below the object, move it to the surface
        if (rayCallback.hasHit()) {
            const hitPoint = rayCallback.get_m_hitPointWorld();
            position.setY(hitPoint.y() + sizeY);
            this.#fallVelocity = 0;
            return;
        }

        // otherwise, updates object's fall velocity
        const gravity = this.sceneRef?.world.gravity || -9.82;
        this.#fallVelocity += gravity * dt * -1;

        // move the object down by the fall distance
        const fallDistance = this.#fallVelocity * dt;
        position.setY(position.y() - fallDistance);
    }
}

export { KinematicCharacterEntity };

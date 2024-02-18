import { type Ammo } from "ammo";

import { BodyType } from "./enums";

type Body = Ammo.btRigidBody;

type BodyOptions = {
    mass?: number;
    friction?: number;
    type?: BodyType;
    size?: THREE.Vector3;
    origin?: THREE.Vector3;
};

export { type Body, type BodyOptions };

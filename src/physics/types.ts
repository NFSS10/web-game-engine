import { type Ammo } from "ammo";

import { BodyType } from "./enums";

type Body = Ammo.btRigidBody;

type BodyOptions = {
    mass: number;
    friction: number;
    type?: BodyType;
};

export { type Body, type BodyOptions };

import { type Ammo } from "ammo";

type Body = Ammo.btRigidBody;

type BodyOptions = {
    mass: number;
    friction: number;
};

export { type Body, type BodyOptions };

import { type Ammo } from "ammo";

type World = Ammo.btDiscreteDynamicsWorld;

type Body = Ammo.btRigidBody;

type BodyOptions = {
    mass: number;
    friction: number;
};

export { type World, type Body, type BodyOptions };

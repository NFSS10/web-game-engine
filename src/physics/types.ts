import { type Ammo } from "ammo";

import { type Size } from "@src/types";
import { BodyType } from "./enums";

type Body = Ammo.btRigidBody;

type BodyOptions = {
    mass?: number;
    friction?: number;
    type?: BodyType;
    origin?: Size;
};

export { type Body, type BodyOptions };

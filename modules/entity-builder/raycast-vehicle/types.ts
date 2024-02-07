import { type Ammo } from "ammo";

import { WheelState } from "./enums";

type WheelData = {
    mesh: THREE.Object3D;
    state: WheelState;
    wheelInfo?: Ammo.btWheelInfo;
    options: WheelOptions;
};

type WheelOptions = {
    engineForce: number;
    brakeForce: number;
    isFrontWheel: boolean;
    radius: number;
    friction: number;
    suspensionStiffness: number;
    suspensionDamping: number;
    suspensionCompression: number;
    suspensionRestLength: number;
    rollInfluence: number;
};

export { type WheelData, type WheelOptions };

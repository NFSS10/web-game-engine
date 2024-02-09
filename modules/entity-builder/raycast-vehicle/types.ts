import { WheelState } from "./enums";

type WheelData = {
    mesh: THREE.Object3D;
    state: WheelState;
    steeringValue: number;
    options: WheelOptions;
};

type WheelOptions = {
    engineForce: number;
    brakeForce: number;
    steeringLimit: number;
    steeringIncrement: number;
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

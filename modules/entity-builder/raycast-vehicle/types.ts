import { MovementState, SteeringState } from "./enums";

type WheelData = {
    mesh: THREE.Object3D;
    movementState: MovementState;
    steeringState: SteeringState;
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

enum WheelIndex {
    FRONT_LEFT = 0,
    FRONT_RIGHT = 1,
    BACK_LEFT = 2,
    BACK_RIGHT = 3
}

enum MovementState {
    NONE = 0,
    ACCELERATING = 1,
    BRAKING = 2,
    REVERSING = 3
}

enum SteeringState {
    NONE = 0,
    LEFT = 1,
    RIGHT = 2
}

export { WheelIndex, MovementState, SteeringState };

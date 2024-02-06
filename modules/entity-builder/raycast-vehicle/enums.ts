enum WheelIndex {
    FRONT_LEFT = 0,
    FRONT_RIGHT = 1,
    BACK_LEFT = 2,
    BACK_RIGHT = 3
}

enum WheelState {
    NONE = 0,
    STEERING_LEFT = 1,
    STEERING_RIGHT = 2,
    ACCELERATING = 3,
    BRAKING = 4,
    REVERSING = 5
}

export { WheelIndex, WheelState };

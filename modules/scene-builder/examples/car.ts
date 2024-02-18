import { EntityBuilder } from "@modules";
import { Scene } from "@src/scene";

const buildCarScene = (scene: Scene, entityBuilder: EntityBuilder): Scene => {
    // creates a static floor
    const floor = entityBuilder.createPrimitive("cube", { id: "floor" });
    floor.object.scale.set(50, 0.1, 50); // scales the floor
    floor.object.position.set(0, -3, 0); // positions the floor
    floor.enablePhysics({ mass: 0 }); // setting the mass to 0 makes the object static
    scene.addEntity(floor);

    // creates a car entity
    const car = entityBuilder.createRaycastVehicle({ id: "car" });
    car.object.position.set(0, -1.25, 0); // positions the car on top of the floor
    car.enablePhysics();
    scene.addEntity(car);

    // example of basic controls for the car
    const keys = { w: false, a: false, s: false, d: false, space: false };
    const control = () => {
        if (keys.w) car.accelerate();
        if (keys.s) car.reverse();
        if (keys.space) car.handbrake();
        if (!keys.w && !keys.s && !keys.space) car.clearMovementState();

        if (keys.a) car.steerLeft();
        if (keys.d) car.steerRight();
        if (!keys.a && !keys.d) car.steerNone();
    };

    window.addEventListener("keydown", function (event) {
        if (event.key in keys) keys[event.key] = true;
        if (event.key === " ") keys.space = true;
        control();
    });
    window.addEventListener("keyup", function (event) {
        if (event.key in keys) keys[event.key] = false;
        if (event.key === " ") keys.space = false;
        control();
    });

    return scene;
};

export { buildCarScene };

import { type EntityBuilder } from "@modules";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { type Scene } from "@src/scene";

const buildCarScene = (scene: Scene, entityBuilder: EntityBuilder): Scene => {
    // creates a static floor
    const floor = entityBuilder.createPrimitive(PrimitiveType.Cube, { id: "floor" });
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
    const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false, space: false };
    const control = (): void => {
        if (keys.w) car.accelerate();
        if (keys.s) car.reverse();
        if (keys.space) car.handbrake();
        if (!keys.w && !keys.s && !keys.space) car.clearMovementState();

        if (keys.a) car.steerLeft();
        if (keys.d) car.steerRight();
        if (!keys.a && !keys.d) car.steerNone();
    };

    window.addEventListener("keydown", event => {
        const key = event.key as string;
        if (key in keys) keys[key] = true;
        if (key === " ") keys.space = true;
        control();
    });
    window.addEventListener("keyup", event => {
        const key = event.key as string;
        if (key in keys) keys[key] = false;
        if (key === " ") keys.space = false;
        control();
    });

    return scene;
};

export { buildCarScene };

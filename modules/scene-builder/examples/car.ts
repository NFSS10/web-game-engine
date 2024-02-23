import * as THREE from "three";

import { type EntityBuilder } from "@modules";
import { type Scene } from "@src/scene";
import { addFloor, addEnvironment } from "./utils";

const buildCarScene = async (scene: Scene, entityBuilder: EntityBuilder): Promise<Scene> => {
    // floor setup
    addFloor(scene, entityBuilder);

    // scene environment setup
    await addEnvironment(scene);

    // creates a car entity
    const car = entityBuilder.createRaycastVehicle({ id: "car" });
    car.object.position.set(0, -1.25, 0); // positions the car on top of the floor
    car.enablePhysics();
    scene.addEntity(car);

    // make the car cast shadows
    car.object.traverse(child => {
        if (child instanceof THREE.Mesh) child.castShadow = true;
    });

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

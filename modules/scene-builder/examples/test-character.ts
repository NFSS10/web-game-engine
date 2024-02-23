import * as THREE from "three";

import { type EntityBuilder } from "@modules";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { type Scene } from "@src/scene";
import { addFloor, addEnvironment } from "./utils";

const buildTestCharacterScene = async (scene: Scene, entityBuilder: EntityBuilder): Promise<Scene> => {
    // floor setup
    addFloor(scene, entityBuilder);

    // scene environment setup
    await addEnvironment(scene);

    // creates random boxes
    for (let i = 0; i < 30; i++) {
        const box = entityBuilder.createPrimitive(PrimitiveType.Cube, { id: `box-${i}` });
        (box.object as THREE.Mesh).castShadow = true;
        box.object.position.set(Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5);
        box.enablePhysics();
        scene.addEntity(box);
    }

    // creates a kinematic character
    const character = entityBuilder.createTestCharacter({ id: "character" });
    character.enablePhysics();
    scene.addEntity(character);

    // make the character cast shadows
    (character.object as THREE.Mesh).castShadow = true;

    // example of basic character controls
    const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false, space: false };
    const control = (): void => {
        if (keys.w) character.moveZ(2.5);
        if (keys.s) character.moveZ(-2.5);
        if (keys.a) character.moveX(2.5);
        if (keys.d) character.moveX(-2.5);
        if (keys.space) character.jump();
        if (!keys.w && !keys.s && !keys.a && !keys.d) {
            character.moveX(0);
            character.moveZ(0);
        }
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

export { buildTestCharacterScene };

import { EntityBuilder } from "@modules";
import { TestCharacter } from "@modules/entity-builder/kinematic-character";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { Scene } from "@src/scene";

const buildTestCharacterScene = (scene: Scene, entityBuilder: EntityBuilder): Scene => {
    // creates a static floor
    const floor = entityBuilder.createPrimitive(PrimitiveType.Cube, { id: "floor" });
    floor.object.scale.set(50, 0.1, 50); // scales the floor
    floor.object.position.set(0, -3, 0); // positions the floor
    floor.enablePhysics({ mass: 0 }); // setting the mass to 0 makes the object static
    scene.addEntity(floor);

    // creates random boxes
    for (let i = 0; i < 30; i++) {
        const box = entityBuilder.createPrimitive(PrimitiveType.Cube, { id: `box-${i}` });
        box.object.position.set(Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5);
        box.enablePhysics();
        scene.addEntity(box);
    }

    // creates a kinematic character
    const character = entityBuilder.createTestCharacter({ id: "character" }) as TestCharacter;
    character.enablePhysics();
    scene.addEntity(character);

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

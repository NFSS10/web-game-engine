import { type EntityBuilder } from "@modules";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { type Scene } from "@src/scene";
import { addFloor } from "./utils";

const buildDebuggerScene = (scene: Scene, entityBuilder: EntityBuilder): Scene => {
    // floor setup
    addFloor(scene, entityBuilder);

    // creates random boxes
    for (let i = 0; i < 30; i++) {
        const box = entityBuilder.createPrimitive(PrimitiveType.Cube, { id: `box-${i}` });
        box.object.position.set(Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5);
        box.enablePhysics();
        scene.addEntity(box);
    }

    return scene;
};

export { buildDebuggerScene };

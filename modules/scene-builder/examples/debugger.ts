import { EntityBuilder } from "@modules";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { Scene } from "@src/scene";

const buildDebuggerScene = (scene: Scene, entityBuilder: EntityBuilder): Scene => {
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

    return scene;
};

export { buildDebuggerScene };

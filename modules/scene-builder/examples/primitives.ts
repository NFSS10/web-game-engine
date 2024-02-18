import { EntityBuilder } from "@modules";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { Scene } from "@src/scene";

const buildPrimitivesScene = (scene: Scene, entityBuilder: EntityBuilder): Scene => {
    // creates a static floor
    const floor = entityBuilder.createPrimitive(PrimitiveType.Cube, { id: "floor" });
    floor.object.scale.set(50, 0.1, 50);
    floor.object.position.set(0, -3, 0);
    floor.enablePhysics({ mass: 0 });
    scene.addEntity(floor);

    // list of all PrimitiveType
    const primitives = Object.values(PrimitiveType);
    for (let i = 0; i < 50; i++) {
        const randomIdx = Math.floor(Math.random() * primitives.length);
        const primitive = primitives[randomIdx]!;

        const entity = entityBuilder.createPrimitive(primitive, { id: `primitive-${i}` });
        entity.object.position.set(Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5);
        entity.enablePhysics();
        scene.addEntity(entity);
    }

    return scene;
};

export { buildPrimitivesScene };

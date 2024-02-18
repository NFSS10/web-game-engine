import { EntityBuilder, Module } from "@modules";
import { Scene } from "@src/scene";
import { AssetLoader } from "@src/loaders";
import { type SceneBuilderOptions } from "./types";

class SceneBuilder extends Module {
    constructor() {
        super();
    }

    createEmptyScene(options?: SceneBuilderOptions): Scene {
        const id = options?.id ?? "default";

        const scene = new Scene(id);
        return scene;
    }

    createExampleScene(entityBuilder: EntityBuilder, options?: SceneBuilderOptions): Scene {
        const id = options?.id ?? "default";

        const scene = new Scene(id);

        // creates a static floor
        const floor = entityBuilder.createPrimitive("cube", { id: "floor" });
        floor.object.scale.set(50, 0.1, 50); // scales the floor
        floor.object.position.set(0, -3, 0); // positions the floor
        floor.enablePhysics({ mass: 0 }); // setting the mass to 0 makes the object static
        scene.addEntity(floor);

        return scene;
    }
}

export { SceneBuilder };

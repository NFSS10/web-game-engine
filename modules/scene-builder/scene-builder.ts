import { EntityBuilder, Module } from "@modules";
import { Scene } from "@src/scene";
import { type SceneBuilderOptions } from "./types";
import { buildCarScene, buildPrimitivesScene } from "./examples";
import { Example } from "./examples/enums";

class SceneBuilder extends Module {
    constructor() {
        super();
    }

    createEmptyScene(options?: SceneBuilderOptions): Scene {
        const scene = new Scene(options?.id);
        return scene;
    }

    createExampleScene(example: Example, entityBuilder: EntityBuilder, options?: SceneBuilderOptions): Scene {
        const scene = new Scene(options?.id);
        switch (example) {
            case Example.Primitives:
                return buildPrimitivesScene(scene, entityBuilder);
            case Example.Debugger:
                return scene;
            case Example.Car:
                return buildCarScene(scene, entityBuilder);
            case Example.TestCharacter:
                return scene;
            case Example.Character:
                return scene;
            default:
                throw new Error(`Unsupported example scene: ${example}`);
        }
    }
}

export { SceneBuilder };

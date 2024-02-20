import { type EntityBuilder, Module } from "@modules";
import { Scene } from "@src/scene";
import { type SceneBuilderOptions } from "./types";
import {
    buildCarScene,
    buildDebuggerScene,
    buildPrimitivesScene,
    buildTestCharacterScene,
    buildCharacterScene
} from "./examples";
import { Example } from "./examples/enums";

class SceneBuilder extends Module {
    constructor() {
        super();
    }

    createEmptyScene(options?: SceneBuilderOptions): Scene {
        const scene = new Scene(options?.id);
        return scene;
    }

    async createExampleScene(
        example: Example,
        entityBuilder: EntityBuilder,
        options?: SceneBuilderOptions
    ): Promise<Scene> {
        const scene = new Scene(options?.id);
        switch (example) {
            case Example.Primitives:
                return await buildPrimitivesScene(scene, entityBuilder);
            case Example.Debugger:
                return buildDebuggerScene(scene, entityBuilder);
            case Example.Car:
                return await buildCarScene(scene, entityBuilder);
            case Example.TestCharacter:
                return await buildTestCharacterScene(scene, entityBuilder);
            case Example.Character:
                return await buildCharacterScene(scene, entityBuilder);
            default:
                throw new Error(`Unsupported example scene: ${example}`);
        }
    }
}

export { SceneBuilder };

import { Module, EntityBuilder, SceneBuilder } from "@modules";
import { ModuleType } from "./types";

abstract class ModuleLoader {
    static SUPPORTED_MODULES = Object.values(ModuleType);

    static #sceneBuilder?: SceneBuilder;
    static #entityBuilder?: EntityBuilder;

    static async loadModule(module: ModuleType): Promise<Module> {
        const isValid = this.SUPPORTED_MODULES.includes(module);
        if (!isValid) throw new Error(`Module ${module} not supported`);

        switch (module) {
            case ModuleType.SCENE_BUILDER:
                return await this.#loadSceneBuilder();
            case ModuleType.ENTITY_BUILDER:
                return await this.#loadEntityBuilder();
            default:
                throw new Error(`Module ${module} not supported`);
        }
    }

    static async #loadSceneBuilder(): Promise<SceneBuilder> {
        if (this.#sceneBuilder) return this.#sceneBuilder;

        const module = await import("../../../modules/scene-builder");
        this.#sceneBuilder = new module.SceneBuilder();
        return this.#sceneBuilder;
    }

    static async #loadEntityBuilder(): Promise<EntityBuilder> {
        if (this.#entityBuilder) return this.#entityBuilder;

        const module = await import("../../../modules/entity-builder");
        this.#entityBuilder = new module.EntityBuilder();
        return this.#entityBuilder;
    }
}

export { ModuleLoader };

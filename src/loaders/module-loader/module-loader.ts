import { Module, EntityBuilder, SceneBuilder } from "@modules";

abstract class ModuleLoader {
    static SUPPORTED_MODULES = ["entity-loader", "scene-builder"];

    static #sceneBuilder?: SceneBuilder;
    static #entityBuilder?: EntityBuilder;

    static async loadModule(module: string): Promise<Module> {
        const isValid = this.SUPPORTED_MODULES.includes(module);
        if (!isValid) throw new Error(`Module ${module} not supported`);

        switch (module) {
            case "scene-builder":
                return await this.#loadSceneBuilder();
            case "entity-builder":
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

    static async #loadEntityBuilder(): Promise<SceneBuilder> {
        if (this.#entityBuilder) return this.#entityBuilder;

        const module = await import("../../../modules/entity-builder");
        this.#entityBuilder = new module.EntityBuilder();
        return this.#entityBuilder;
    }
}

export { ModuleLoader };

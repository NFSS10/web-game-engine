import { Module, SceneBuilder } from "../../../../modules";

abstract class ModuleLoader {
    static SUPPORTED_MODULES = ["scene-builder"];

    static #sceneBuilder?: SceneBuilder;

    static async loadModule(module: string): Promise<Module> {
        const isValid = this.SUPPORTED_MODULES.includes(module);
        if (!isValid) throw new Error(`Module ${module} not supported`);

        switch (module) {
            case "scene-builder":
                return await this.#loadSceneBuilder();
            default:
                throw new Error(`Module ${module} not supported`);
        }
    }

    static async #loadSceneBuilder(): Promise<SceneBuilder> {
        if (this.#sceneBuilder) return this.#sceneBuilder;

        const module = await import("../../../../modules/scene-builder");
        this.#sceneBuilder = new module.SceneBuilder();
        return this.#sceneBuilder;
    }
}

export { ModuleLoader };

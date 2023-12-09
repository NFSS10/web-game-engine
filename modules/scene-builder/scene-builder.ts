import { Module } from "@modules";
import { Scene } from "@src/scene";

class SceneBuilder extends Module {
    constructor() {
        super();
    }

    createScene(id: string): Scene {
        const scene = new Scene(id);
        return scene;
    }
}

export { SceneBuilder };

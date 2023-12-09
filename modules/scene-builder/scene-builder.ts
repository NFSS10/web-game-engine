import { Scene } from "../../src/scene";
import { Module } from "../module";

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

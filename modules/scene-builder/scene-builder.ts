import { Scene } from "../../src/scene";
import { Module } from "../module";

class SceneBuilder extends Module {
    constructor() {
        super();
    }

    createScene(): Scene {
        const scene = new Scene();
        return scene;
    }
}

export { SceneBuilder };

import { Module } from "@modules";
import GameEngine from "@src/game-engine";
import { Scene } from "@src/scene";

class SceneBuilder extends Module {
    constructor(engine: GameEngine) {
        super(engine);
    }

    createScene(id: string): Scene {
        const scene = new Scene(id);
        return scene;
    }
}

export { SceneBuilder };

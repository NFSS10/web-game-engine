import GameEngine from "@src/game-engine";

class Module {
    #engine: GameEngine;

    constructor(engine: GameEngine) {
        this.#engine = engine;
    }

    get Engine(): GameEngine {
        return this.#engine;
    }
}

export { Module };

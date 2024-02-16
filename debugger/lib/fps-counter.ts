class FPSCounter {
    fps: number;
    frameTimes: number[];

    #lastTime: number;
    #fpsCounterTimeElapsed: number;
    #fpsCounter: number;

    constructor() {
        this.fps = 0;
        this.frameTimes = [];

        this.#lastTime = Date.now();
        this.#fpsCounterTimeElapsed = 0;
        this.#fpsCounter = 0;
    }

    tick(): void {
        // calculates the frame time
        const now = Date.now();
        const frameTime = now - this.#lastTime;
        this.#lastTime = now;

        // updates the frame times
        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > 1000) this.frameTimes.shift();

        // updates the frame counter
        this.#fpsCounterTimeElapsed += frameTime;
        this.#fpsCounter++;
        if (this.#fpsCounterTimeElapsed >= 1000) {
            this.fps = this.#fpsCounter;
            this.#fpsCounter = 0;
            this.#fpsCounterTimeElapsed = 0;
        }
    }
}

export { FPSCounter };

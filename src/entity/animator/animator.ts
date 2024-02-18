import * as THREE from "three";

class Animator {
    #mixer: THREE.AnimationMixer;
    #animations: Record<string, THREE.AnimationClip>;

    constructor(object: THREE.Object3D) {
        this.#mixer = new THREE.AnimationMixer(object);

        this.#animations = {};
        const animations = object.animations ?? [];
        animations.forEach(clip => this.addAnimation(clip));
    }

    get animations(): string[] {
        return Object.keys(this.#animations);
    }

    tick(delta: number): void {
        this.#mixer.update(delta);
    }

    addAnimation(clip: THREE.AnimationClip, name?: string): void {
        name = name || clip.name;

        if (this.#animations[name]) {
            console.warn(`Animation ${name} already exists, skipping...`);
            return;
        }

        this.#animations[name] = clip;
    }

    removeAnimation(name: string): void {
        delete this.#animations[name];
    }

    play(name: string): void {
        const clip = this.#getClip(name);
        if (!clip) return;

        const action = this.#mixer.clipAction(clip);
        action.play();
    }

    stop(name: string): void {
        const clip = this.#getClip(name);
        if (!clip) return;

        const action = this.#mixer.clipAction(clip);
        action.stop();
    }

    pause(name: string): void {
        const clip = this.#getClip(name);
        if (!clip) return;

        const action = this.#mixer.clipAction(clip);
        action.paused = true;
    }

    resume(name: string): void {
        const clip = this.#getClip(name);
        if (!clip) return;

        const action = this.#mixer.clipAction(clip);
        action.paused = false;
    }

    #getClip(name: string): THREE.AnimationClip | null {
        const clip = this.#animations[name];
        if (!clip) {
            console.warn(`Animation ${name} not found`);
            return null;
        }

        return clip;
    }
}

export { Animator };

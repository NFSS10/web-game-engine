import * as THREE from "three";

import { type EntityBuilder } from "@modules";
import { AssetLoader } from "@src/loaders";
import { type Scene } from "@src/scene";
import { addEnvironment, addFloor } from "./utils";

const buildCharacterScene = async (scene: Scene, entityBuilder: EntityBuilder): Promise<Scene> => {
    // floor setup
    addFloor(scene, entityBuilder);

    // scene environment setup
    await addEnvironment(scene);

    const characterMesh = await AssetLoader.loadFBX(
        "https://cdn-static-nfss10.netlify.app/web-game-engine/assets/characters/models/y-bot.fbx"
    );
    characterMesh.scale.set(0.015, 0.015, 0.015);

    // make the character cast shadows
    characterMesh.traverse(child => {
        if (child instanceof THREE.Mesh) child.castShadow = true;
    });

    // change character mesh origin
    const characterNode = new THREE.Object3D();
    characterNode.add(characterMesh);
    characterMesh.position.set(0, -1.35, 0);

    const character = entityBuilder.createKinematicCharacter(characterNode, { id: "character" });
    character.enablePhysics({ size: { x: 0.75, y: 2.7, z: 0.75 } });
    scene.addEntity(character);

    // load animations
    const promises = [
        AssetLoader.loadFBX(
            "https://cdn-static-nfss10.netlify.app/web-game-engine/assets/characters/animations/warrior-idle.fbx"
        ),
        AssetLoader.loadFBX(
            "https://cdn-static-nfss10.netlify.app/web-game-engine/assets/characters/animations/joyful-jump.fbx"
        ),
        AssetLoader.loadFBX(
            "https://cdn-static-nfss10.netlify.app/web-game-engine/assets/characters/animations/walking.fbx"
        )
    ];
    const [idleAnim, jumpAnim, walkingAnim] = await Promise.all(promises);
    if (!idleAnim || !jumpAnim || !walkingAnim) throw new Error("Failed to load animations");

    // add animations to the character
    character.Animator.addAnimation(idleAnim.animations[0]!, "idle");
    character.Animator.addAnimation(jumpAnim.animations[0]!, "jump");
    character.Animator.addAnimation(walkingAnim.animations[0]!, "walking");

    // play idle animation
    character.Animator.play("idle");

    // example of basic character controls
    const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false, space: false };
    const control = (): void => {
        if (keys.w) character.moveZ(2.5);
        if (keys.s) character.moveZ(-2.5);
        if (keys.a) character.moveX(2.5);
        if (keys.d) character.moveX(-2.5);
        if (keys.space) character.jump();
        if (!keys.w && !keys.s && !keys.a && !keys.d) character.stop();
    };

    window.addEventListener("keydown", event => {
        const key = event.key as string;
        if (key in keys) keys[key] = true;
        if (key === " ") keys.space = true;
        control();
    });
    window.addEventListener("keyup", event => {
        const key = event.key as string;
        if (key in keys) keys[key] = false;
        if (key === " ") keys.space = false;
        control();
    });

    return scene;
};

export { buildCharacterScene };

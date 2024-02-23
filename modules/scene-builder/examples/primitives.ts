import * as THREE from "three";

import { type EntityBuilder } from "@modules";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { type Scene } from "@src/scene";
import { addEnvironment, addFloor } from "./utils";

const buildPrimitivesScene = async (scene: Scene, entityBuilder: EntityBuilder): Promise<Scene> => {
    // floor setup
    addFloor(scene, entityBuilder);

    // scene environment setup
    await addEnvironment(scene);

    // list of all PrimitiveType
    const primitives = Object.values(PrimitiveType);
    for (let i = 0; i < 50; i++) {
        // create a random primitive entity
        const randomIdx = Math.floor(Math.random() * primitives.length);
        const primitive = primitives[randomIdx]!;
        const entity = entityBuilder.createPrimitive(primitive, { id: `primitive-${i}` });

        // make entity cast shadows
        (entity.object as THREE.Mesh).castShadow = true;

        // random position and material
        entity.object.position.set(Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5);
        (entity.object as THREE.Mesh).material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: Math.random(),
            metalness: Math.random()
        });

        // enable physics
        entity.enablePhysics();

        // add entity to the scene
        scene.addEntity(entity);
    }

    return scene;
};

export { buildPrimitivesScene };

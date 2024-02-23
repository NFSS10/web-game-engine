import * as THREE from "three";

import { type EntityBuilder } from "@modules";
import { PrimitiveType } from "@modules/entity-builder/primitives/enums";
import { type Scene } from "@src/scene";
import { AssetLoader } from "@src/loaders";

const addFloor = (scene: Scene, entityBuilder: EntityBuilder): void => {
    const floor = entityBuilder.createPrimitive(PrimitiveType.Cube, { id: "floor" });
    floor.object.scale.set(50, 0.1, 50); // scales the floor
    floor.object.position.set(0, -3, 0); // positions the floor
    floor.enablePhysics({ mass: 0 }); // setting the mass to 0 makes the object static

    // changes floor material
    const mesh = floor.object as THREE.Mesh;
    mesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    // enables shadows for the floor
    mesh.receiveShadow = true;

    // adds the floor to the scene
    scene.addEntity(floor);
};

const addEnvironment = async (scene: Scene): Promise<void> => {
    const envTexture = await AssetLoader.loadHDRI(
        "https://cdn-static-nfss10.netlify.app/web-game-engine/assets/environments/resting_place_2_1k.hdr"
    );

    // access the THREE.Scene object and set the environment
    scene.scene.environment = envTexture;
    scene.scene.background = envTexture;

    // add directional light to simulate the sun casting shadows
    const directLight = new THREE.DirectionalLight(0xffffff, 1);
    directLight.position.set(40, 40, 40);
    directLight.lookAt(0, 0, 0);
    directLight.castShadow = true;
    directLight.shadow.camera.left = -20;
    directLight.shadow.camera.right = 20;
    directLight.shadow.camera.top = 20;
    directLight.shadow.camera.bottom = -20;
    directLight.shadow.camera.near = 0.5;
    directLight.shadow.camera.far = 100;
    directLight.shadow.mapSize.width = 2048;
    directLight.shadow.mapSize.height = 2048;
    scene.scene.add(directLight);
};

export { addFloor, addEnvironment };

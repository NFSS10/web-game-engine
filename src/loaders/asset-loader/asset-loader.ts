import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

abstract class AssetLoader {
    static #rgbeLoader: RGBELoader;
    static #gltfLoader: GLTFLoader;
    static #fbxLoader: FBXLoader;

    static init(renderer: THREE.WebGLRenderer): void {
        this.#initGLTFLoader(renderer);
        this.#rgbeLoader = new RGBELoader();
        this.#fbxLoader = new FBXLoader();
    }

    static async loadHDRI(url: string): Promise<THREE.Texture> {
        const texture = await this.#rgbeLoader.loadAsync(url);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        return texture;
    }

    static async loadGLTF(url: string): Promise<THREE.Object3D> {
        const gltf = await this.#gltfLoader.loadAsync(url);
        const mesh = gltf.scene;

        return mesh;
    }

    static async loadFBX(url: string): Promise<THREE.Object3D> {
        const mesh = await this.#fbxLoader.loadAsync(url);
        return mesh;
    }

    static #initGLTFLoader(renderer: THREE.WebGLRenderer): void {
        // draco loader setup
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
        dracoLoader.preload();

        // ktx2 loader setup
        const ktx2Loader = new KTX2Loader();
        ktx2Loader.setTranscoderPath("https://cdn.jsdelivr.net/npm/three/examples/js/libs/basis/");
        ktx2Loader.detectSupport(renderer);

        // gltf loader setup
        this.#gltfLoader = new GLTFLoader();
        this.#gltfLoader.setDRACOLoader(dracoLoader);
        this.#gltfLoader.setKTX2Loader(ktx2Loader);
    }
}

export { AssetLoader };

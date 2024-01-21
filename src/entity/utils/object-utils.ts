import * as THREE from 'three';

abstract class ObjectUtils {
    static getBoundingBoxSize(object: THREE.Object3D): THREE.Vector3 {
        // backup original rotation because the Box3 we want is going to be OBB instead of AABB
        const originalRotation = object.rotation.clone();

        // remove rotation from the mesh so that the bounding box is always aligned with the mesh
        object.rotation.set(0, 0, 0);

        // creates bounding box
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        box.getSize(size);

        // restore rotation
        object.rotation.copy(originalRotation);

        return size;
    }
}

export { ObjectUtils };
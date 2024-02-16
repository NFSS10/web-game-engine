import * as THREE from "three";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";

import { type Ammo } from "ammo";

import { PhysicsDebugDrawMode } from "@debugger/enums";
import { Physics } from "@src/physics";

type DebugLine = {
    from: THREE.Vector3;
    to: THREE.Vector3;
    color: THREE.Color;
};

class PhysicsDrawer {
    #lineMesh: LineSegments2;
    #debugDrawer: Ammo.DebugDrawer;
    #mode: number;
    #lines: DebugLine[];

    constructor(lineWidth?: number) {
        lineWidth = lineWidth ?? 0.0025;

        this.#lines = [];

        const geometry = new LineSegmentsGeometry();
        const material = new LineMaterial({
            color: 0xffffff,
            linewidth: lineWidth,
            vertexColors: true
        });
        this.#lineMesh = new LineSegments2(geometry, material);

        this.#debugDrawer = new Physics.Ammo.DebugDrawer();
        this.#mode = PhysicsDebugDrawMode.DBG_DrawWireframe;

        this.#debugDrawer.setDebugMode = this.#setMode.bind(this);
        this.#debugDrawer.getDebugMode = this.#getMode.bind(this);
        this.#debugDrawer.drawLine = this.#drawLine.bind(this);
    }

    get debugDrawer(): Ammo.DebugDrawer {
        return this.#debugDrawer;
    }

    get lineMesh(): THREE.Mesh {
        return this.#lineMesh;
    }

    draw(): void {
        const vertices: number[] = [];
        const colors: number[] = [];

        this.#lines.forEach(line => {
            // push the "from" and "to" coordinates to "vertices"
            vertices.push(line.from.x, line.from.y, line.from.z);
            vertices.push(line.to.x, line.to.y, line.to.z);

            // push the color for both the "from" and "to" points
            colors.push(line.color.r, line.color.g, line.color.b);
            colors.push(line.color.r, line.color.g, line.color.b);
        });

        const verticesArray = new Float32Array(vertices);
        const colorsArray = new Float32Array(colors);
        this.#lineMesh.geometry.setPositions(verticesArray);
        this.#lineMesh.geometry.setColors(colorsArray);

        this.#lines = [];
    }

    #drawLine(from: number, to: number, color: number): void {
        const fromVector = Physics.Ammo.wrapPointer(from, Physics.Ammo.btVector3);
        const toVector = Physics.Ammo.wrapPointer(to, Physics.Ammo.btVector3);
        const colorVector = Physics.Ammo.wrapPointer(color, Physics.Ammo.btVector3);

        this.#lines.push({
            from: new THREE.Vector3(fromVector.x(), fromVector.y(), fromVector.z()),
            to: new THREE.Vector3(toVector.x(), toVector.y(), toVector.z()),
            color: new THREE.Color(colorVector.x(), colorVector.y(), colorVector.z())
        });
    }

    #getMode(): number {
        return this.#mode;
    }

    #setMode(newMode: number): void {
        this.#mode = newMode;
    }
}

export { PhysicsDrawer };

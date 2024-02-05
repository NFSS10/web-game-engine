import { Module } from "@modules";
import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Capsule, Cone, Cube, Cylinder, Sphere } from "./primitives";
import { PrimitiveType } from "./primitives/enums";
import { RaycastVehicleEntity } from "./raycast-vehicle";
import { type EntityBuilderOptions } from "./types";

class EntityBuilder extends Module {
    constructor() {
        super();
    }

    get supportedPrimitives(): string[] {
        return Object.values(PrimitiveType);
    }

    createPrimitive(type: PrimitiveType, options?: EntityBuilderOptions): Entity {
        const entityOptions: EntityOptions = {};
        if (options?.id) entityOptions.id = options.id;

        switch (type) {
            case PrimitiveType.Capsule:
                return new Capsule(entityOptions);
            case PrimitiveType.Cone:
                return new Cone(entityOptions);
            case PrimitiveType.Cube:
                return new Cube(entityOptions);
            case PrimitiveType.Cylinder:
                return new Cylinder(entityOptions);
            case PrimitiveType.Sphere:
                return new Sphere(entityOptions);
            default:
                throw new Error(`Unsupported primitive type: ${type}`);
        }
    }

    createRaycastVehicle(): Entity {
        return new RaycastVehicleEntity();
    }
}

export { EntityBuilder };

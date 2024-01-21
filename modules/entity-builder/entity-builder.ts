import { Module } from "@modules";
import { Entity } from "@src/entity";
import { type EntityOptions } from "@src/entity/types";
import { Cube } from "./primitives";
import { PrimitiveType } from "./primitives/enums";
import { type EntityBuilderOptions } from "./types";

class EntityBuilder extends Module {
    constructor() {
        super();
    }

    get supportedPrimitives(): string[] {
        return Object.values(PrimitiveType);
    }

    createPrimitive(type: PrimitiveType, options?: EntityBuilderOptions): Entity {
        /* const createBody = options?.createBody ?? false; */

        const entityOptions: EntityOptions = {};
        if (options?.id) entityOptions.id = options.id;

        let primitiveType: Cube;
        switch (type) {
            case PrimitiveType.Cube:
                primitiveType = new Cube(entityOptions);
                break;
            default:
                throw new Error(`Unsupported primitive type: ${type}`);
        }

        /* if (createBody) primitiveType.generateBody(options?.bodyOptions); */

        return primitiveType;
    }
}

export { EntityBuilder };

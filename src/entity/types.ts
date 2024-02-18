import { type Size } from "@src/types";
import { type BodyOptions } from "@src/physics/types";

type EntityOptions = {
    id?: string;
};

type CreateBodyOptions = BodyOptions & {
    size?: Size;
};

export { type EntityOptions, type CreateBodyOptions };

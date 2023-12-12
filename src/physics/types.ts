// eslint-disable-next-line @typescript-eslint/no-explicit-any
type World = any; // TODO improve types

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Body = any; // TODO improve types

type BodyOptions = {
    mass: number;
    friction: number;
};

export { type World, type Body, type BodyOptions };

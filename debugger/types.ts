type RendererInfo = {
    memory: {
        geometries: number;
        textures: number;
    };
    render: {
        calls: number;
        triangles: number;
        points: number;
        lines: number;
        frame: number;
    };
};

export { type RendererInfo };

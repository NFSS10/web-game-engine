/* eslint-disable */
import tsConfigPaths from "rollup-plugin-tsconfig-paths";
import replace from "@rollup/plugin-replace";
import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import packageJson from "./package.json" assert { type: "json" };

const env = process.env.ENV || "PROD";
const buildTarget = process.env.BUILD_TARGET || null;

const input = "src/game-engine.ts";

const replaceOpts = {
    include: ["src/game-engine.ts"],
    delimiters: ["<%", "%>"],
    values: {
        VERSION: packageJson.version
    },
    preventAssignment: true
};
const terserOpts = {
    mangle: {
        properties: {
            regex: /^#/
        }
    }
};

// ES Modules step
const esmStep = {
    input: input,
    plugins: [tsConfigPaths(), replace(replaceOpts), esbuild(), env === "PROD" ? terser(terserOpts) : undefined],
    output: {
        format: "es",
        dir: "dist/esm",
        sourcemap: env === "DEV"
    }
};

// CommonJS step
const cjsStep = {
    input: input,
    plugins: [
        tsConfigPaths(),
        replace(replaceOpts),
        esbuild({ tsconfig: "tsconfig.cjs.json" }),
        env === "PROD" ? terser(terserOpts) : undefined
    ],
    output: {
        format: "cjs",
        dir: "dist/cjs",
        sourcemap: env === "DEV"
    }
};

// Browser bundle step
const bundleStep = {
    input: input,
    plugins: [
        tsConfigPaths(),
        replace(replaceOpts),
        esbuild(),
        nodeResolve(),
        env === "PROD" ? terser(terserOpts) : undefined
    ],
    output: {
        format: "es",
        dir: "dist/bundle",
        sourcemap: env === "DEV"
    }
};

// Types step
const typesStep = {
    input: input,
    plugins: [dts()],
    output: {
        file: "dist/types.d.ts"
    }
};

const steps = [];
if (!buildTarget || buildTarget === "ESM") steps.push(esmStep);
if (!buildTarget || buildTarget === "CJS") steps.push(cjsStep);
if (!buildTarget || buildTarget === "BUNDLE") steps.push(bundleStep);
steps.push(typesStep);

export default steps;

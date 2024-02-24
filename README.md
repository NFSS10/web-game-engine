# :video_game: Web Game Engine

Just a simple wannabe game engine to help me quickly prototype and showcase some little fun projects to my friends :smile:

Hopefully, it will also help someone understand how some things work behind the scenes and be the push they need to start their projects! Happy coding!

It's a hobby project so don't expect too much from it or regular updates :sweat_smile:

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Playground](#playground)
-   [Development](#development)
-   [About](#about)
    -   [Motivation](#motivation)
    -   [Future Work](#future-work)

## Installation

To use the bundled version, you can simply import it from the CDN:

```
https://cdn-static-nfss10.netlify.app/bundles/web-game-engine/<version>/game-engine.js
```

Where `<version>` is the version you want to use. You can use `latest` to get the latest version or lock it to a specific version number. For example, for version `3.1.2`, you could lock it to `3` major version, `3.1` minor version or `3.1.2` patch version.

## Usage

```html
<script type="module">
    import { GameEngine } from "https://cdn-static-nfss10.netlify.app/bundles/web-game-engine/latest/game-engine.js";

    const engine = new GameEngine();
    console.info("Version:", engine.VERSION);
</script>
```

This [example](examples/example.html) should help you get started with the engine. For more examples, check the [examples](examples) folder.

## Playground

Click on the images to open the demos:

[![example_thumbnail](https://github.com/NFSS10/cdn-static/assets/22588915/9a414839-3b15-4217-bb4a-6fddcba278aa)](https://gamedev-playground.nfss10.com/web-game-engine/example)
[![debugger_thumbnail](https://github.com/NFSS10/web-game-engine/assets/22588915/290eec55-37fc-4649-b952-7a16be5ba60a)](https://gamedev-playground.nfss10.com/web-game-engine/debugger)
[![primitives_thumbnail](https://github.com/NFSS10/web-game-engine/assets/22588915/47db109d-6cd6-45a3-a1af-c95a330c539d)](https://gamedev-playground.nfss10.com/web-game-engine/primitives)
[![test-character_thumbnail](https://github.com/NFSS10/web-game-engine/assets/22588915/d3bc6735-de6e-4c70-aabc-063130b5b972)](https://gamedev-playground.nfss10.com/web-game-engine/test-character)
[![character_thumbnail](https://github.com/NFSS10/web-game-engine/assets/22588915/edc2b443-7693-482c-b9d9-c5b55c4ae1f1)](https://gamedev-playground.nfss10.com/web-game-engine/character)
[![car_thumbnail](https://github.com/NFSS10/web-game-engine/assets/22588915/3a3d1f78-c5f1-4236-9b82-db8d971edd72)](https://gamedev-playground.nfss10.com/web-game-engine/car)

## Development

**Build the project:**

```bash
yarn build
```

Building in development mode (not minified and with source maps enabled):

```bash
yarn build-dev
```

**Hot reload:**

```bash
yarn watch
```

You can also selectively watch a specific build by running: `watch-cjs`, `watch-esm` or `watch-bundle` for the CommonJS, ESM or bundled build respectively.

**Serve the bundle:**

```bash
yarn serve
```

## About

### Motivation

I have always been fascinated by video games and how everything works behind the scenes, especially because there are a lot of clever and cool tricks that allow them to work around the limitations of the systems they run on.

Recently, I found myself in a position where I needed to teach and explain concepts related to 3D graphics. One conclusion I reached is that some of these concepts
aren't straightforward to grasp or contain some complexity that makes it harder for some developers to start, especially if they are beginners.

That's where this project comes in! My mission is to try and create a simple "game engine" that is modular, extendable and very simple to use. I'm trying to keep it as simple and concise as possible while also trying to abstract the more complex parts so that it can be used as a learning tool and a starting point for anyone who wants to start their own projects.

### Future work

-   Example of highly dense and performant grass
-   Post-processing effects
-   Camera system
-   Interactive scene builder
-   Improve the animator
-   Kinematic character colliding with static objects
-   Shaders shenanigans
-   Inverse Kinematics
-   Whatever I feel like doing :smile:

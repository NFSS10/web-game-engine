# Web Game Engine

Just a simple wannabe game engine to help me quickly prototype and showcase some little fun projects to my friends :smile:

## Usage

```html
<script type="module">
    import { GameEngine } from "http://localhost:8080/game-engine.js";

    const engine = new GameEngine();
    console.info("Version:", engine.VERSION);
</script>
```

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

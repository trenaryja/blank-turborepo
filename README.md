# blank-turborepo

A minimal Turborepo template — `apps/` for deployables, `packages/` for shared code.

## Stack

- [Turborepo](https://turbo.build) (task orchestration + caching)
- [Bun](https://bun.sh) (package manager + workspaces)
- [TypeScript](https://www.typescriptlang.org)
- [Biome](https://biomejs.dev) (lint + format, configured at root, cascades)

## Layout

```
blank-turborepo/
├── apps/                  # Deployables (Next, Vite, etc.) — empty by default
└── packages/
    └── config/            # Shared TS base config; extend via "@repo/config/tsconfig.base.json"
```

## Adding an app

```sh
bun make:app next web   # Next.js app at apps/web
bun make:app vite web   # or a Vite SPA
bun install             # wire it into the workspace
```

`make:app` clones the template, strips the inner `biome.jsonc` (root cascades), and renames the package to `@repo/<name>`. After install, optionally rewrite `apps/<name>/tsconfig.json` to `extends: "@repo/config/tsconfig.base.json"` if you want shared TS config.

## Scripts

- `bun dev` — `turbo run dev` across all apps
- `bun build` — `turbo run build`
- `bun fix` — biome write
- `bun check` — typecheck + biome (extend with `&& turbo run check` once apps define one)
- `bun make:app <next|vite> <name>` — scaffold a new app under `apps/`

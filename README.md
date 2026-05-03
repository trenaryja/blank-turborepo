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

Drop a template in via degit, rename, install:

```sh
# Next app
bunx degit trenaryja/blank-next-app apps/web

# Or a Vite SPA
bunx degit trenaryja/blank-vite-app apps/web

# Then in apps/web/package.json: rename to "@repo/web"
# Optionally delete apps/web/biome.jsonc (root cascades)
# Optionally rewrite apps/web/tsconfig.json to extend "@repo/config/tsconfig.base.json"

bun install
```

## Scripts

- `bun dev` — `turbo run dev` across all apps
- `bun build` — `turbo run build`
- `bun fix` — biome write
- `bun check` — biome lint (extend with `&& turbo run check` once apps define one)

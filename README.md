# blank-turborepo

A minimal Turborepo template — `apps/` for deployables, `packages/` for shared code.

## Stack

- [Turborepo](https://turbo.build) (task orchestration + caching)
- [Bun](https://bun.sh) (package manager + workspaces)
- [TypeScript](https://www.typescriptlang.org)
- [`@trenaryja/config`](https://github.com/trenaryja/config) (ESLint + Prettier + shared tsconfig, configured at root, cascades)

## Layout

```
blank-turborepo/
├── apps/                  # Deployables (Next, Vite, etc.) — empty by default
└── packages/              # Shared code — empty by default
```

## Adding an app

```sh
bun make:app next web   # Next.js app at apps/web
bun make:app vite web   # or a Vite SPA
bun install             # wire it into the workspace
```

`make:app` clones the template, strips the inner lint configs (root cascades), and renames the package to `@repo/<name>`.

## Scripts

- `bun dev` — `turbo run dev` across all apps
- `bun build` — `turbo run build`
- `bun fix` — prettier + eslint write
- `bun check` — typecheck + prettier + eslint (extend with `&& turbo run check` once apps define one)
- `bun make:app <next|vite> <name>` — scaffold a new app under `apps/`

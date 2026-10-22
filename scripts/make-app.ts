import { $ } from 'bun'
import { existsSync, rmSync } from 'node:fs'
import { z } from 'zod'

const TEMPLATES = {
	next: 'trenaryja/blank-next-app',
	vite: 'trenaryja/blank-vite-app',
} as const

const isTemplate = (x: string): x is keyof typeof TEMPLATES => Object.hasOwn(TEMPLATES, x)

const [template, name] = Bun.argv.slice(2)
const usage = `Usage: bun make:app <${Object.keys(TEMPLATES).join('|')}> <name>`

if (!template || !name || !isTemplate(template)) {
	console.error(usage)
	process.exit(1)
}

const dest = `apps/${name}`

if (existsSync(dest)) {
	console.error(`${dest} already exists`)
	process.exit(1)
}

const repo = TEMPLATES[template]
await $`git clone --depth=1 https://github.com/${repo}.git ${dest}`
rmSync(`${dest}/.git`, { recursive: true, force: true })

const packagePath = `${dest}/package.json`
const packageJson = z.looseObject({}).safeParse(await Bun.file(packagePath).json())
if (!packageJson.success) throw new Error(`${packagePath}: ${z.prettifyError(packageJson.error)}`)
await Bun.write(packagePath, `${JSON.stringify({ ...packageJson.data, name: `@repo/${name}` }, null, '\t')}\n`)

// the workspace root owns lint, renovate and the lockfile; the app keeps its own tsconfig and prettier key
for (const file of ['eslint.config.mjs', 'renovate.json', 'bun.lock']) {
	const innerConfig = `${dest}/${file}`
	if (existsSync(innerConfig)) rmSync(innerConfig)
}

console.log(`Created ${dest} from ${repo}. Run 'bun install' from the workspace root.`)

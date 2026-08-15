import { existsSync, rmSync } from 'node:fs'
import { $ } from 'bun'

const TEMPLATES = {
	next: 'trenaryja/blank-next-app',
	vite: 'trenaryja/blank-vite-app',
} as const

const isTemplate = (x: string): x is keyof typeof TEMPLATES => x in TEMPLATES

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
const packageJson = await Bun.file(packagePath).json()
packageJson.name = `@repo/${name}`
await Bun.write(packagePath, `${JSON.stringify(packageJson, null, '\t')}\n`)

// Root config cascades — the app keeps only its own tsconfig/prettier references
for (const file of ['eslint.config.mjs', 'renovate.json', 'biome.jsonc']) {
	const innerConfig = `${dest}/${file}`
	if (existsSync(innerConfig)) rmSync(innerConfig)
}

console.log(`Created ${dest} from ${repo}. Run 'bun install' from the workspace root.`)

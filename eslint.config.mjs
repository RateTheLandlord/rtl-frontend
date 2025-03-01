import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'
import { fixupConfigRules } from '@eslint/compat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

const patchedConfig = fixupConfigRules([
	...compat.extends('next/core-web-vitals'),
])

export default tseslint.config({
	extends: [
		patchedConfig,
		tseslint.configs.recommendedTypeChecked,
		prettierConfigRecommended,
	],
	ignores: [
		'node_modules/*',
		'dist',
		'coverage',
		'.next/*',
		'*.json',
		'*.lock',
		'*.css',
		'*.scss',
		'out/*',
		'next-env.d.ts',
		'util/countries',
		'*.mjs',
		'migrations/*',
		'.next',
	],
	languageOptions: {
		parserOptions: {
			projectService: true,
			tsconfigRootDir: __dirname,
		},
	},
})

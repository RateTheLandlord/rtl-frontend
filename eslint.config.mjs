/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config({
	extends: [
		js.configs.recommended,
		tseslint.configs.recommendedTypeChecked,
		prettierConfigRecommended,
	],
	plugins: {
		'@next/next': nextPlugin,
	},
	rules: {
		...nextPlugin.configs['core-web-vitals'].rules,
	},
	ignores: [
		'node_modules/*',
		'dist',
		'coverage',
		'.next/*',
		'out/*',
		'*.json',
		'*.lock',
		'*.css',
		'*.scss',
		'next-env.d.ts',
		'util/countries',
		'migrations/*',
	],
	languageOptions: {
		parserOptions: {
			projectService: true,
		},
	},
})

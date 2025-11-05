/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
	// globals tsConfig deprecated, relevant SO issue: https://stackoverflow.com/questions/68656057/why-isnt-ts-jest-loading-my-custom-tsconfig-file
	transform: {
		// '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
		// '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
		'^.+\\.[tj]sx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.jest.json',
			},
		],
	},
	moduleNameMapper: {
		// "@/*": ["./*"]
		'^@/(.*)$': ['<rootDir>/$1'],
	},
	transformIgnorePatterns: [`/node_modules/(?!next-recaptcha-v3)`],
	globals: {
		fetch: global.fetch,
	},
}

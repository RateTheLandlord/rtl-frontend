module.exports = {
	apps: [
		{
			name: 'rtl-frontend',
			script: 'node_modules/.bin/next', // Path to the Next.js CLI
			args: 'start', // Arguments to pass to the Next.js CLI
			interpreter: 'node',
			instances: 1, // Number of instances to start
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
}

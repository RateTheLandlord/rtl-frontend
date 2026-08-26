import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
				background: 'rgb(var(--color-background) / <alpha-value>)',
			},
			height: {
				128: '41rem', // Adds a custom height of 32rem (512px)
			},
			fontFamily: {
				inclusive: ['Inclusive Sans', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 4s ease-in',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
		},
	},
	plugins: [typography, forms, aspectRatio],
}

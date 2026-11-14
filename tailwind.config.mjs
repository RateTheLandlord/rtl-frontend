import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',

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

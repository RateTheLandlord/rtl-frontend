/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			height: {
				'128': '41rem', // Adds a custom height of 32rem (512px)
			  },
			fontFamily: {
				'montserrat-regular': ['Montserrat-Regular', 'sans-serif'],
				'montserrat-medium': ['Montserrat-Medium', 'sans-serif'],
				'montserrat-bold': ['Montserrat-Bold', 'sans-serif'],
				'montserrat-extra-bold': ['Montserrat-Extra-Bold', 'sans-serif'],
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
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
	],
}

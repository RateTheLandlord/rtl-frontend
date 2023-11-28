export const getRandomColour = () => {
	const red = Math.floor(Math.random() * 256)
	const green = Math.floor(Math.random() * 256)
	const blue = Math.floor(Math.random() * 256)

	// Convert RGB components to a hex string
	const hex = `#${red.toString(16).padStart(2, '0')}${green
		.toString(16)
		.padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`

	return hex
}

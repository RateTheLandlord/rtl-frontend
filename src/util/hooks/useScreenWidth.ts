import { useState, useEffect } from 'react'

const useScreenWidth = () => {
	const [screenWidth, setScreenWidth] = useState<number>(0)

	useEffect(() => {
		const handleResize = () => setScreenWidth(window.innerWidth)

		handleResize() // Set initial width
		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return screenWidth
}

export default useScreenWidth

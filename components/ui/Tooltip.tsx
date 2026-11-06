import { JSX, useEffect, useRef, useState } from 'react'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

type TooltipProps = {
	children: JSX.Element
	text: string
	position?: TooltipPosition
}

const positionClasses: Record<TooltipPosition, string> = {
	top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
	bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
	left: 'right-full top-1/2 mr-2 -translate-y-1/2',
	right: 'left-full top-1/2 ml-2 -translate-y-1/2',
}

const arrowClasses: Record<TooltipPosition, string> = {
	top: 'top-full left-1/2 -translate-x-1/2 border-t-black border-r-transparent border-l-transparent border-t-4 border-r-4 border-l-4',
	bottom:
		'bottom-full left-1/2 -translate-x-1/2 border-b-black border-r-transparent border-l-transparent border-b-4 border-r-4 border-l-4',
	left: 'left-full top-1/2 -translate-y-1/2 border-l-black border-t-transparent border-b-transparent border-l-4 border-t-4 border-b-4',
	right:
		'right-full top-1/2 -translate-y-1/2 border-r-black border-t-transparent border-b-transparent border-r-4 border-t-4 border-b-4',
}

const Tooltip = ({ children, text, position = 'top' }: TooltipProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const tooltipRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (
				tooltipRef.current &&
				!tooltipRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('touchstart', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('touchstart', handleClickOutside)
		}
	}, [])

	return (
		<div
			ref={tooltipRef}
			className='group relative inline-block'
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				type='button'
				className='cursor-pointer'
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
			>
				{children}
			</button>

			<div
				role='tooltip'
				className={`absolute z-50 w-max max-w-44 rounded bg-black px-2 py-1 text-center text-xs text-white transition-opacity ${
					positionClasses[position]
				} ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
			>
				{text}

				<div className={`absolute h-0 w-0 ${arrowClasses[position]}`} />
			</div>
		</div>
	)
}

export default Tooltip

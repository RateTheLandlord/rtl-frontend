import { createContext, useContext } from 'react'

import type { ModalPropsMap, ModalType } from './modalRegistry'

export type ModalContextValue = {
	openModal: <T extends ModalType>(type: T, props: ModalPropsMap[T]) => void
	closeModal: () => void
}

export const ModalContext = createContext<ModalContextValue | null>(null)

export function useModal(): ModalContextValue {
	const context = useContext(ModalContext)

	if (!context) {
		throw new Error('useModal must be used within ModalProvider')
	}

	return context
}

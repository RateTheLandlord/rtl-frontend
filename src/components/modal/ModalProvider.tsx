import {
	useCallback,
	useState,
	type ComponentType,
	type ReactNode,
} from 'react'

import { ModalContext } from './ModalContext'
import {
	modalRegistry,
	type ModalControls,
	type ModalPropsMap,
	type ModalRequest,
	type ModalType,
} from './modalRegistry'

type ModalProviderProps = {
	children: ReactNode
}

type RenderableModalProps = ModalPropsMap[ModalType] & ModalControls

const ModalProvider = ({ children }: ModalProviderProps) => {
	const [activeModal, setActiveModal] = useState<ModalRequest | null>(null)

	const openModal = useCallback(
		<T extends ModalType>(type: T, props: ModalPropsMap[T]) => {
			setActiveModal({
				type,
				props,
			} as ModalRequest)
		},
		[],
	)

	const closeModal = useCallback(() => {
		setActiveModal(null)
	}, [])

	const contextValue = {
		openModal,
		closeModal,
	}

	const ActiveModal: ComponentType<RenderableModalProps> | null = activeModal
		? (modalRegistry[activeModal.type] as ComponentType<RenderableModalProps>)
		: null

	return (
		<ModalContext.Provider value={contextValue}>
			{children}

			{ActiveModal && activeModal && (
				<ActiveModal
					{...(activeModal.props as RenderableModalProps)}
					onClose={closeModal}
				/>
			)}
		</ModalContext.Provider>
	)
}

export default ModalProvider

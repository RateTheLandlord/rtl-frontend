import type { ComponentType } from 'react'

import type {
	Keywords,
	Resource,
	Review,
	SuspiciousLandlord,
	UserReview,
} from '@/util/interfaces/interfaces'

import type { Candidate } from '@/components/admin/sections/MergeDuplicateLandlords'

import UserRemoveReviewModal from './UserRemoveReviewModal'
import UserEditReviewModal from './UserEditReviewModal'
import ReportModal from '@/components/reviews/report-modal'
import RestoreReviewModal from './RestoreReviewModal'
import DeleteNowModal from './DeleteNowModal'
import RemoveReviewModal from './RemoveReviewModal'
import EditReviewModal from './EditReviewModal'
import RemoveResourceModal from './RemoveResourceModal'
import AddResourceModal from './AddResourceModal'
import AddFlaggedKeywordModal from './AddFlaggedKeywordModal'
import RemoveFlaggedKeywordModal from './RemoveFlaggedKeywordModal'
import AddSuspiciousLandlordModal from './AddSuspiciousLandlordModal'
import EditSuspiciousLandlordModal from './EditSuspiciousLandlordModal'
import RemoveSuspiciousLandlordModal from './RemoveSuspiciousLandlordModal'
import CopyUserCodeModal from './CopyUserCodeModal'
import SuccessModal from './success-modal'
import SpamReviewModal from './SpamReviewModal'
import EditResourceModal from './EditResourceModal'
import MergeLandlordsModal from './MergeLandlordsModal'

export type ModalControls = {
	onClose: () => void
}

/**
 * Props each modal receives from openModal().
 *
 * ModalControls are injected by the provider and should not
 * be included in these definitions.
 */
export type ModalPropsMap = {
	userRemoveReview: {
		selectedReview: UserReview
		userKey: string
	}
	userEditReview: {
		selectedReview: UserReview
		userKey: string
	}
	report: {
		selectedReview: UserReview
	}
	restoreReview: {
		selectedReview: Review
	}
	deleteNow: {
		selectedReview: Review
	}
	adminRemoveReview: {
		selectedReview: Review
	}
	adminEditReview: {
		selectedReview: Review
	}
	removeResource: {
		selectedResource: Resource
	}
	addResource: Record<never, never>
	addFlaggedKeyword: Record<never, never>
	removeFlaggedKeyword: {
		selectedKeyword: Keywords
	}
	addSuspiciousLandlord: Record<never, never>
	editSuspiciousLandlord: {
		selectedSuspiciousLandlord: SuspiciousLandlord
	}
	removeSuspiciousLandlord: {
		selectedSuspiciousLandlord: SuspiciousLandlord
	}
	copyUserCode: {
		code: string
	}
	success: Record<never, never>
	spamReview: {
		landlord: string
		detectionMethod: string
	}
	editResource: {
		selectedResource: Resource
	}
	mergeLandlords: {
		selectedLandlords: Candidate[]
		landlordName: string
		country: string
	}
}

export type ModalType = keyof ModalPropsMap

type ModalRegistry = {
	[K in ModalType]: ComponentType<ModalPropsMap[K] & ModalControls>
}

export const modalRegistry = {
	userRemoveReview: UserRemoveReviewModal,
	userEditReview: UserEditReviewModal,
	report: ReportModal,
	restoreReview: RestoreReviewModal,
	deleteNow: DeleteNowModal,
	adminRemoveReview: RemoveReviewModal,
	adminEditReview: EditReviewModal,
	removeResource: RemoveResourceModal,
	addResource: AddResourceModal,
	addFlaggedKeyword: AddFlaggedKeywordModal,
	removeFlaggedKeyword: RemoveFlaggedKeywordModal,
	addSuspiciousLandlord: AddSuspiciousLandlordModal,
	editSuspiciousLandlord: EditSuspiciousLandlordModal,
	removeSuspiciousLandlord: RemoveSuspiciousLandlordModal,
	copyUserCode: CopyUserCodeModal,
	success: SuccessModal,
	spamReview: SpamReviewModal,
	editResource: EditResourceModal,
	mergeLandlords: MergeLandlordsModal,
} satisfies ModalRegistry

/**
 * Discriminated union preserving the relationship between
 * a modal identifier and its corresponding props.
 */
export type ModalRequest = {
	[K in ModalType]: {
		type: K
		props: ModalPropsMap[K]
	}
}[ModalType]

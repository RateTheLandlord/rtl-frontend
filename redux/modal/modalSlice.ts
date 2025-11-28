import {
	Keywords,
	Resource,
	Review,
	SuspiciousLandlord,
	UserReview,
} from '@/util/interfaces/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	selectedReview: UserReview | undefined
	selectedAdminReview: Review | undefined
	selectedResource: Resource | undefined
	selectedKeyword: Keywords | undefined
	selectedSuspiciousLandlord: SuspiciousLandlord | undefined
	copyUserCodeOpen: boolean
	deleteNowOpen: boolean
	editResourceOpen: boolean
	addResourceOpen: boolean
	adminEditReviewOpen: boolean
	removeResourceOpen: boolean
	adminRemoveReviewOpen: boolean
	restoreReviewOpen: boolean
	userEditReviewOpen: boolean
	userRemoveReviewOpen: boolean
	userReportModalOpen: boolean
	userKey: string
	addFlaggedKeywordOpen: boolean
	removedFlaggedKeywordOpen: boolean
	addSuspiciousLandlordOpen: boolean
	editSuspiciousLandlordOpen: boolean
	removeSuspiciousLandlordOpen: boolean
	successModalOpen: boolean
	spamReviewModalOpen: boolean
	spamDetectionMethod: string
	landlord: string
}

const initialState: InitialState = {
	selectedReview: undefined,
	selectedAdminReview: undefined,
	selectedResource: undefined,
	selectedKeyword: undefined,
	selectedSuspiciousLandlord: undefined,
	copyUserCodeOpen: false,
	deleteNowOpen: false,
	editResourceOpen: false,
	addResourceOpen: false,
	adminEditReviewOpen: false,
	removeResourceOpen: false,
	adminRemoveReviewOpen: false,
	restoreReviewOpen: false,
	userEditReviewOpen: false,
	userRemoveReviewOpen: false,
	userReportModalOpen: false,
	userKey: '',
	addFlaggedKeywordOpen: false,
	removedFlaggedKeywordOpen: false,
	addSuspiciousLandlordOpen: false,
	editSuspiciousLandlordOpen: false,
	removeSuspiciousLandlordOpen: false,
	successModalOpen: false,
	spamReviewModalOpen: false,
	spamDetectionMethod: 'localStorageDetection',
	landlord: '',
}

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		updateSelectedReview(state, action: PayloadAction<UserReview | undefined>) {
			state.selectedReview = action.payload
		},
		updateSelectedAdminReview(
			state,
			action: PayloadAction<Review | undefined>,
		) {
			state.selectedAdminReview = action.payload
		},
		updateSelectedResource(state, action: PayloadAction<Resource | undefined>) {
			state.selectedResource = action.payload
		},
		updateSelectedKeyword(state, action: PayloadAction<Keywords | undefined>) {
			state.selectedKeyword = action.payload
		},
		updateSelectedSuspiciousLandlord(
			state,
			action: PayloadAction<SuspiciousLandlord | undefined>,
		) {
			state.selectedSuspiciousLandlord = action.payload
		},
		updateCopyUserCodeOpen(state, action: PayloadAction<boolean>) {
			state.copyUserCodeOpen = action.payload
		},
		updateDeleteNowOpen(state, action: PayloadAction<boolean>) {
			state.deleteNowOpen = action.payload
		},
		updateEditResourceOpen(state, action: PayloadAction<boolean>) {
			state.editResourceOpen = action.payload
		},
		updateAddResourceOpen(state, action: PayloadAction<boolean>) {
			state.addResourceOpen = action.payload
		},
		updateAdminEditReviewOpen(state, action: PayloadAction<boolean>) {
			state.adminEditReviewOpen = action.payload
		},
		updateRemoveResourceOpen(state, action: PayloadAction<boolean>) {
			state.removeResourceOpen = action.payload
		},
		updateAdminRemoveReviewOpen(state, action: PayloadAction<boolean>) {
			state.adminRemoveReviewOpen = action.payload
		},
		updateRestoreReviewOpen(state, action: PayloadAction<boolean>) {
			state.restoreReviewOpen = action.payload
		},
		updateUserEditReviewOpen(state, action: PayloadAction<boolean>) {
			state.userEditReviewOpen = action.payload
		},
		updateUserRemoveReviewOpen(state, action: PayloadAction<boolean>) {
			state.userRemoveReviewOpen = action.payload
		},
		updateUserReportModal(state, action: PayloadAction<boolean>) {
			state.userReportModalOpen = action.payload
		},
		updateUserKey(state, action: PayloadAction<string>) {
			state.userKey = action.payload
		},
		updateAddFlaggedKeywordOpen(state, action: PayloadAction<boolean>) {
			state.addFlaggedKeywordOpen = action.payload
		},
		updateRemoveFlaggedKeywordOpen(state, action: PayloadAction<boolean>) {
			state.removedFlaggedKeywordOpen = action.payload
		},
		updateAddSuspiciousLandlordOpen(state, action: PayloadAction<boolean>) {
			state.addSuspiciousLandlordOpen = action.payload
		},
		updateEditSuspiciousLandlordOpen(state, action: PayloadAction<boolean>) {
			state.editSuspiciousLandlordOpen = action.payload
		},
		updateRemoveSuspiciousLandlordOpen(state, action: PayloadAction<boolean>) {
			state.removeSuspiciousLandlordOpen = action.payload
		},
		updateSuccessModalOpen(state, action: PayloadAction<boolean>) {
			state.successModalOpen = action.payload
		},
		updateSpamReviewModalOpen(state, action: PayloadAction<boolean>) {
			state.spamReviewModalOpen = action.payload
		},
		updateSpamDetectionMethod(state, action: PayloadAction<string>) {
			state.spamDetectionMethod = action.payload
		},
	},
})

export const {
	updateSelectedReview,
	updateSelectedAdminReview,
	updateSelectedResource,
	updateSelectedKeyword,
	updateSelectedSuspiciousLandlord,
	updateCopyUserCodeOpen,
	updateDeleteNowOpen,
	updateEditResourceOpen,
	updateAddResourceOpen,
	updateAdminEditReviewOpen,
	updateRemoveResourceOpen,
	updateAdminRemoveReviewOpen,
	updateRestoreReviewOpen,
	updateUserEditReviewOpen,
	updateUserRemoveReviewOpen,
	updateUserReportModal,
	updateUserKey,
	updateAddFlaggedKeywordOpen,
	updateRemoveFlaggedKeywordOpen,
	updateAddSuspiciousLandlordOpen,
	updateEditSuspiciousLandlordOpen,
	updateRemoveSuspiciousLandlordOpen,
	updateSuccessModalOpen,
	updateSpamReviewModalOpen,
	updateSpamDetectionMethod,
} = modalSlice.actions
export default modalSlice.reducer

import { useAppSelector } from '@/redux/hooks'
import UserRemoveReviewModal from './UserRemoveReviewModal'
import ReportModal from '../reviews/report-modal'
import UserEditReviewModal from './UserEditReviewModal'
import RestoreReviewModal from './RestoreReviewModal'
import DeleteNow from './DeleteNowModal'
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

const ModalProvider = ({ children }: { children: JSX.Element }) => {
	const {
		userRemoveReviewOpen,
		userReportModalOpen,
		userEditReviewOpen,
		restoreReviewOpen,
		deleteNowOpen,
		adminRemoveReviewOpen,
		adminEditReviewOpen,
		removeResourceOpen,
		addResourceOpen,
		addFlaggedKeywordOpen,
		removedFlaggedKeywordOpen,
		addSuspiciousLandlordOpen,
		editSuspiciousLandlordOpen,
		removeSuspiciousLandlordOpen,
		copyUserCodeOpen,
		successModalOpen,
		spamReviewModalOpen,
	} = useAppSelector((state) => state.modal)
	return (
		<>
			{userRemoveReviewOpen && <UserRemoveReviewModal />}
			{userEditReviewOpen && <UserEditReviewModal />}
			{userReportModalOpen && <ReportModal />}
			{restoreReviewOpen && <RestoreReviewModal />}
			{deleteNowOpen && <DeleteNow />}
			{adminRemoveReviewOpen && <RemoveReviewModal />}
			{adminEditReviewOpen && <EditReviewModal />}
			{removeResourceOpen && <RemoveResourceModal />}
			{addResourceOpen && <AddResourceModal />}
			{addFlaggedKeywordOpen && <AddFlaggedKeywordModal />}
			{removedFlaggedKeywordOpen && <RemoveFlaggedKeywordModal />}
			{addSuspiciousLandlordOpen && <AddSuspiciousLandlordModal />}
			{editSuspiciousLandlordOpen && <EditSuspiciousLandlordModal />}
			{removeSuspiciousLandlordOpen && <RemoveSuspiciousLandlordModal />}
			{copyUserCodeOpen && <CopyUserCodeModal />}
			{successModalOpen && <SuccessModal />}
			{spamReviewModalOpen && <SpamReviewModal />}
			{children}
		</>
	)
}

export default ModalProvider

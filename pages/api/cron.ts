import cron from 'node-cron'
import { getDeleted, deleteReview } from '@/lib/review/review'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

const readyToDelete = (delete_date: string | null): boolean => {
	if (delete_date && delete_date.length > 0) {
		const [day, month, year] = delete_date.split('/').map(Number)
		if (day && month && year) {
			const deleteDate = dayjs(`${year}-${month}-${day}`).startOf('day')
			const today = dayjs().startOf('day')
			return deleteDate.isBefore(today) || deleteDate.isSame(today)
		}
	}
	return false
}

// Schedule a cron job to run every day
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
cron.schedule('0 0 * * *', async () => {
	const reviews = await getDeleted()

	for (const review of reviews) {
		if (readyToDelete(dayjs(review.delete_date).format('DD/MM/YYYY'))) {
			if (review.id) {
				await deleteReview(review.id)
				console.log(`Review with ID ${review.id} has been deleted.`)
			}
		}
	}
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ message: 'Cron job API is running!' })
}

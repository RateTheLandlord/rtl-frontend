import cron from 'node-cron'
import { getDeleted, deleteReview } from '@/lib/review/review'

const readyToDelete = (delete_date: string | null): boolean => {
    if (delete_date && delete_date.length > 0) {
        const [day, month, year] = delete_date.split('/').map(Number);
        if (day && month && year) {
          const deleteDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          deleteDate.setHours(0, 0, 0, 0);
          return deleteDate <= today; 
        }
      }
    return false
  };

// Schedule a cron job to run every day
cron.schedule('0 0 * * *', async () => {
	const reviews = await getDeleted();

    console.log("Deleted reviews = ", reviews)

    for (const review of reviews) {
        if (readyToDelete(review.delete_date)) {
            if(review.id){
                await deleteReview(review.id);
                console.log(`Review with ID ${review.id} has been deleted.`);
            }
        }
      }

})

export default function handler(req, res) {
	res.status(200).json({ message: 'Cron job API is running!' })
}

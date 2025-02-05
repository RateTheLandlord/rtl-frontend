// pages/api/cron.ts
import cron from 'node-cron'

// Schedule a cron job to run every minute
cron.schedule('* * * * *', () => {
	console.log('Cron job is running every minute!')
	// Add your task here
})

export default function handler(req, res) {
	res.status(200).json({ message: 'Cron job API is running!' })
}

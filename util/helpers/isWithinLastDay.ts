import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

// Register the plugin
dayjs.extend(isBetween)

const isWithinLastDay = (lastAttempt: Date) => {
	const currDate = new Date()
	const yesterday = dayjs(currDate).subtract(1, 'day')
	return dayjs(lastAttempt).isBetween(yesterday, currDate)
}

export default isWithinLastDay

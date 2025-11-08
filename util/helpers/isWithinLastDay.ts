import dayjs from 'dayjs'

const isWithinLastDay = (lastAttempt: Date) => {
	const currDate = new Date()
	const yesterday = dayjs(currDate).subtract(1, 'day')
	return dayjs(lastAttempt).isBetween(yesterday, currDate)
}

export default isWithinLastDay

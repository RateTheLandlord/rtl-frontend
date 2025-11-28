import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

// Register the plugin
dayjs.extend(isBetween)

const isWithinLastDay = (lastAttempt: Date) => {
	return dayjs().diff(dayjs(lastAttempt), 'hour') < 24
}

export default isWithinLastDay

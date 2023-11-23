import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export const useStatsDates = (value: string) => {
	const [startDate, setStartDate] = useState('')
	const [groupBy, setGroupBy] = useState('')

	useEffect(() => {
		switch (value) {
			case 'last7':
				setStartDate(dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD'))
				setGroupBy('days')
				break
			case 'last14':
				setStartDate(dayjs(new Date()).subtract(14, 'day').format('YYYY-MM-DD'))
				setGroupBy('days')
				break
			case 'last30':
				setStartDate(dayjs(new Date()).subtract(30, 'day').format('YYYY-MM-DD'))
				setGroupBy('days')
				break
			case 'currMonth':
				setStartDate(dayjs().startOf('month').format('YYYY-MM-DD'))
				setGroupBy('days')
				break
			case 'last3m':
				setStartDate(
					dayjs(new Date()).subtract(3, 'month').format('YYYY-MM-DD'),
				)
				setGroupBy('month')
				break
			case 'last6m':
				setStartDate(
					dayjs(new Date()).subtract(6, 'month').format('YYYY-MM-DD'),
				)
				setGroupBy('month')
				break
			case 'last1y':
				setStartDate(dayjs(new Date()).subtract(1, 'year').format('YYYY-MM-DD'))
				setGroupBy('month')
				break
			case 'allTime':
				setStartDate(
					dayjs(new Date()).subtract(10, 'year').format('YYYY-MM-DD'),
				)
				setGroupBy('month')
				break
		}
	}, [value])

	return [startDate, groupBy]
}

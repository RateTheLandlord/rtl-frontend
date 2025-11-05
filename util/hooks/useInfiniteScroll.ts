import { ISortOptions, QueryParams } from '@/components/reviews/review'
import { useState, useRef, useEffect, useCallback } from 'react'

interface QueryParamsInfinite {
	sort: ISortOptions
	state: string
	country: string
	city: string
	zip: string
	search: string
	limit: string
}

interface UseInfiniteScrollProps<T> {
	fetchData: (
		queryParams: QueryParams,
	) => Promise<{ reviews: T[]; total: number }>
	queryParams: QueryParamsInfinite
	initialPage?: number
	offset?: number // Scroll offset for smoother loading
}

const useInfiniteScroll = <T>({
	fetchData,
	queryParams,
	initialPage = 1,
	offset = 100,
}: UseInfiniteScrollProps<T>) => {
	const [reviews, setReviews] = useState<T[]>([])
	const [page, setPage] = useState(initialPage)
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const isFetchingRef = useRef(false)

	// Reset data, page, and hasMore if queryParams change
	useEffect(() => {
		setReviews([])
		setHasMore(true)
	}, [queryParams])

	// Fetch data function
	const loadMore = useCallback(async () => {
		if (isFetchingRef.current || !hasMore) return
		isFetchingRef.current = true
		setIsLoading(true)

		try {
			const response = await fetchData({ ...queryParams, page })
			console.log('RESPONSE: ', response)
			setReviews((prevData) => [...prevData, ...response.reviews])
			setPage((prevPage) => prevPage + 1)
			setHasMore(
				response.reviews.length > 0 &&
					reviews.length + response.reviews.length < response.total,
			)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setIsLoading(false)
			isFetchingRef.current = false
		}
	}, [fetchData, page, hasMore, queryParams, reviews.length])

	// Initial fetch on mount or when queryParams change
	useEffect(() => {
		loadMore().catch(() =>
			console.error('Error with Infinite Scroll Load More'),
		)
	}, [queryParams])

	// Scroll event listener
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
					document.body.offsetHeight - offset &&
				!isFetchingRef.current &&
				hasMore
			) {
				loadMore().catch(() =>
					console.error('Error with Infinite Scroll Load More'),
				)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [loadMore, hasMore, offset, page])

	return { reviews, isLoading }
}

export default useInfiniteScroll

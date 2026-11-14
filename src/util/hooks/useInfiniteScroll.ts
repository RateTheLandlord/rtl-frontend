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
	offset?: number
}

const useInfiniteScroll = <T>({
	fetchData,
	queryParams,
	initialPage = 1,
	offset = 100,
}: UseInfiniteScrollProps<T>) => {
	const [reviews, setReviews] = useState<T[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	// Keep the latest query parameters available to callbacks.
	const queryParamsRef = useRef(queryParams)
	queryParamsRef.current = queryParams

	// A stable identifier for the current filter combination.
	const queryKey = JSON.stringify(queryParams)

	// Pagination state maintained outside React's asynchronous state updates.
	const pageRef = useRef(Math.max(1, initialPage))
	const loadedCountRef = useRef(0)
	const hasMoreRef = useRef(true)

	// Track requests so responses from old filters can be ignored.
	const requestIdRef = useRef(0)
	const isFetchingRef = useRef(false)

	const fetchPage = useCallback(
		async (page: number, params: QueryParamsInfinite, requestId: number) => {
			if (requestId !== requestIdRef.current || isFetchingRef.current) {
				return
			}

			isFetchingRef.current = true
			setIsLoading(true)

			try {
				const response = await fetchData({
					...params,
					page,
				})

				// Ignore results belonging to an outdated filter combination.
				if (requestId !== requestIdRef.current) return

				setReviews((previousReviews) => [
					...previousReviews,
					...response.reviews,
				])

				loadedCountRef.current += response.reviews.length

				pageRef.current = page + 1

				const moreAvailable =
					response.reviews.length > 0 && loadedCountRef.current < response.total

				hasMoreRef.current = moreAvailable
				setHasMore(moreAvailable)
			} catch (error) {
				if (requestId === requestIdRef.current) {
					console.error('Error fetching reviews:', error)
				}
			} finally {
				if (requestId === requestIdRef.current) {
					isFetchingRef.current = false
					setIsLoading(false)
				}
			}
		},
		[fetchData],
	)

	// Reset pagination and fetch the first page when filters change.
	useEffect(() => {
		const requestId = ++requestIdRef.current
		const firstPage = Math.max(1, initialPage)

		isFetchingRef.current = false
		pageRef.current = firstPage
		loadedCountRef.current = 0
		hasMoreRef.current = true

		setReviews([])
		setHasMore(true)

		void fetchPage(firstPage, queryParamsRef.current, requestId)
	}, [queryKey, initialPage, fetchPage])

	// Load the next page using the current query and pagination state.
	const loadMore = useCallback(() => {
		if (isFetchingRef.current || !hasMoreRef.current) {
			return
		}

		void fetchPage(
			pageRef.current,
			queryParamsRef.current,
			requestIdRef.current,
		)
	}, [fetchPage])

	// Register the scroll listener.
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.innerHeight + window.scrollY

			const pageHeight = document.documentElement.scrollHeight

			if (scrollPosition >= pageHeight - offset) {
				loadMore()
			}
		}

		window.addEventListener('scroll', handleScroll, {
			passive: true,
		})

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [loadMore, offset])

	return {
		reviews,
		isLoading,
		hasMore,
	}
}

export default useInfiniteScroll

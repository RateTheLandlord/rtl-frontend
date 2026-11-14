export interface ResourceQuery {
	page?: number
	limit?: string
	search?: string
	sort?: 'az' | 'za' | 'new' | 'old' | 'high' | 'low' | undefined
	country?: string
	state?: string
	city?: string
}

export interface IResponse {
	status: number
	message: string
}

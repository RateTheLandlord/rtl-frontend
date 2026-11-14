import { Keywords } from '@/util/interfaces/interfaces'

export interface IResponse {
	status: number
	message: string
}

export interface getFlaggedKeywordsResponse {
	keywords: Keywords[]
	total: number
}

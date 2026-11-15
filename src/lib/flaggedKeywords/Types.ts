import { Keywords } from '@/util/interfaces/Interfaces'

export interface IResponse {
	status: number
	message: string
}

export interface getFlaggedKeywordsResponse {
	keywords: Keywords[]
	total: number
}

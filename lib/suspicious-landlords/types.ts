import { SuspiciousLandlord } from '@/util/interfaces/interfaces'

export interface IResponse {
	status: number
	message: string
}

export interface GetSuspiciousLandlordResponse {
	landlords: SuspiciousLandlord[]
	total: number
}

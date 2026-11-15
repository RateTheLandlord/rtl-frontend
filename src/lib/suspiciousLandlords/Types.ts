import { SuspiciousLandlord } from '@/util/interfaces/Interfaces'

export interface IResponse {
	status: number
	message: string
}

export interface GetSuspiciousLandlordResponse {
	landlords: SuspiciousLandlord[]
	total: number
}

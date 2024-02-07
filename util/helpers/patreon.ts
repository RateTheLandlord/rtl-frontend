export interface PatreonData {
	data: Array<{
		attributes: {
			full_name: string
		}
		relationships: {
			currently_entitled_tiers: {
				data: Array<{
					id: number
				}>
			}
		}
	}>
	included: Array<{
		id: number
		attributes: {
			title: string
		}
	}>
}

export interface MemberData {
	name: string
	id: number
}

export const getMemberData = (data: PatreonData): Array<MemberData> => {
	const members = data.data.map((item) => {
		const memberData = {
			name: item.attributes.full_name,
			id: item.relationships.currently_entitled_tiers.data[
				item.relationships.currently_entitled_tiers.data.length - 1
			].id,
		}
		return memberData
	})
	return members
}

export interface TierData {
	name: string
	id: number
}

export const getTierData = (data: PatreonData): Array<TierData> => {
	const tiers = data.included.map((item) => {
		const tierData = {
			name: item.attributes.title,
			id: item.id,
		}
		return tierData
	})
	return tiers
}

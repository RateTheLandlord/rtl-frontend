interface PatreonData {
	data: {
		attributes: {
			full_name: string
		}
		relationships: {
			currently_entitled_tiers: {
				data: {
					id: number
				}[]
			}
		}
	}[]
	included: {
		id: number
		attributes: {
			title: string
		}
	}[]
}

export interface MemberData {
	name: string
	id: number
}

export const getMemberData = (data: PatreonData): MemberData[] => {
	const members = data.data.map((item) => {
		const memberData = {
			name: item.attributes.full_name,
			id:
				item.relationships.currently_entitled_tiers.data.length &&
				item.relationships.currently_entitled_tiers.data[
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

export const getTierData = (data: PatreonData): TierData[] => {
	const tiers = data.included.map((item) => {
		const tierData = {
			name: item.attributes.title,
			id: item.id,
		}
		return tierData
	})
	return tiers
}

export interface Review {
	id?: number
	landlord: string
	country_code: string
	city: string
	state: string
	zip: string
	review: string
	repair: number
	health: number
	stability: number
	privacy: number
	respect: number
	date_added: Date // auto-generated by db
	flagged: boolean
	flagged_reason: string
	admin_approved: boolean | null
	admin_edited: boolean
	rent?: number | null
}

export interface OtherLandlord {
	name: string
	avgrating: number
	topcity: string
}

export interface Options {
	id: number
	name: string
	value: string
}

export interface SortOptions {
	id: number
	name: string
	value: 'az' | 'za' | 'new' | 'old' | 'high' | 'low' | undefined
}

export interface NewFilter {
	key: string
	value: string
}

export interface ILinks {
	name: string
	href: string
	icon: JSX.Element
	umami: string
}

export interface INav {
	href: string
	name: string
	umami: string
	mobileumami: string
}

export interface ILocationResponse {
	address: {
		['code']: string
		city: string
		country: string
		country_code: string
		county: string
		postcode: string
		state: string
		state_district: string
	}
	boundingbox: Array<string>
	class: string
	display_name: string
	icon: string
	importance: number
	lat: string
	licence: string
	lon: string
	osm_id: number
	osm_type: string
	place_id: number
	type: string
}

export interface ILocationHookResponse {
	id: number
	city: string
	state: string
}

export interface Resource {
	id: number
	name: string
	country_code: string
	city: string
	state: string
	address?: string
	phone_number?: string
	date_added: Date // auto-generated by db
	description: string
	href: string
}

export interface ResourceResponse {
	resources: Array<Resource>
	total: string
	countries: Array<string>
	states: Array<string>
	cities: Array<string>
	limit: number
}

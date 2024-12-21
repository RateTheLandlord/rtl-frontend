import territories from '@/util/countries/australia/territories.json'
import provinces from '@/util/countries/canada/provinces.json'
import germanyStates from '@/util/countries/germany/states.json'
import counties from '@/util/countries/ireland/counties.json'
import nzProvinces from '@/util/countries/newZealand/nz-provinces.json'
import regions from '@/util/countries/unitedKingdom/regions.json'
import states from '@/util/countries/unitedStates/states.json'
import norwayCounties from '@/util/countries/norway/counties.json'

export const getStates = (country: string | undefined) => {
	switch (country) {
		case 'CA':
			return provinces.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		case 'GB':
			return regions.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		case 'AU':
			return territories.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		case 'DE':
			return germanyStates.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		case 'IE':
			return counties.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		case 'NZ':
			return nzProvinces.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		case 'US':
			return states.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		case 'NO':
			return norwayCounties.map((province, idx) => {
				return {
					id: idx + 1,
					name: province.name,
					value: province.name.toLocaleUpperCase(),
				}
			})
		default:
			return []
	}
}

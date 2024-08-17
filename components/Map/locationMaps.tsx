import usZipLocations from '@/util/countries/usziplocations.json'
import ca_AB_PC from '@/util/countries/canada_postalCodes/ABPostalCodeLocations.json'
import ca_BC_PC from '@/util/countries/canada_postalCodes/BCPostalCodeLocations.json'
import ca_MB_PC from '@/util/countries/canada_postalCodes/MBPostalCodeLocations.json'
import ca_NB_PC from '@/util/countries/canada_postalCodes/NBPostalCodeLocations.json'
import ca_NL_PC from '@/util/countries/canada_postalCodes/NLPostalCodeLocations.json'
import ca_NS_PC from '@/util/countries/canada_postalCodes/NSPostalCodeLocations.json'
import ca_NT_PC from '@/util/countries/canada_postalCodes/NTPostalCodeLocations.json'
import ca_NU_PC from '@/util/countries/canada_postalCodes/NUPostalCodeLocations.json'
import ca_ON_PC from '@/util/countries/canada_postalCodes/ONPostalCodeLocations.json'
import ca_PE_PC from '@/util/countries/canada_postalCodes/PEPostalCodeLocations.json'
import ca_QC_PC from '@/util/countries/canada_postalCodes/QCPostalCodeLocations.json'
import ca_SK_PC from '@/util/countries/canada_postalCodes/SKPostalCodeLocations.json'
import ca_YT_PC from '@/util/countries/canada_postalCodes/YTPostalCodeLocations.json'

interface usLocation {
	'Zip Code': number
	ZipLatitude: number
	ZipLongitude: number
}

// Create a Map for faster lookups
export const usLocationMap = new Map<number, usLocation>(
	usZipLocations.map((loc): [number, usLocation] => [loc['Zip Code'], loc]),
)

const AB_LOCATION_MAP = new Map(
	ca_AB_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const BC_LOCATION_MAP = new Map(
	ca_BC_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const MB_LOCATION_MAP = new Map(
	ca_MB_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const NB_LOCATION_MAP = new Map(
	ca_NB_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const NL_LOCATION_MAP = new Map(
	ca_NL_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const NS_LOCATION_MAP = new Map(
	ca_NS_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const NT_LOCATION_MAP = new Map(
	ca_NT_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const NU_LOCATION_MAP = new Map(
	ca_NU_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const ON_LOCATION_MAP = new Map(
	ca_ON_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const PE_LOCATION_MAP = new Map(
	ca_PE_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const QC_LOCATION_MAP = new Map(
	ca_QC_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const SK_LOCATION_MAP = new Map(
	ca_SK_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

const YT_LOCATION_MAP = new Map(
	ca_YT_PC.map((loc) => [
		loc['POSTAL_CODE'].replace(/\s+/g, '').toUpperCase(),
		loc,
	]),
)

export const provinceMaps = {
	ALBERTA: AB_LOCATION_MAP,
	'BRITISH COLUMBIA': BC_LOCATION_MAP,
	MANITOBA: MB_LOCATION_MAP,
	'NEW BRUNSWICK': NB_LOCATION_MAP,
	'NEWFOUNDLAND AND LABRADOR': NL_LOCATION_MAP,
	'NORTHWEST TERRITORIES': NT_LOCATION_MAP,
	'NOVA SCOTIA': NS_LOCATION_MAP,
	NUNAVUT: NU_LOCATION_MAP,
	ONTARIO: ON_LOCATION_MAP,
	'PRINCE EDWARD ISLAND': PE_LOCATION_MAP,
	QUEBEC: QC_LOCATION_MAP,
	SASKATCHEWAN: SK_LOCATION_MAP,
	YUKON: YT_LOCATION_MAP,
}

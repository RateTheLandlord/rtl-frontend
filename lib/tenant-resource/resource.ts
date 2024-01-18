import { Resource, ResourcesResponse } from './models/resource'
import { createResource, updateResource } from './models/resource-data-layer'
import sql from '../db'

type ResourceQuery = {
	page?: number
	limit?: number
	search?: string
	sort?: 'az' | 'za' | 'new' | 'old'
	country?: string
	state?: string
	city?: string
}

export async function get(params: ResourceQuery): Promise<ResourcesResponse> {
	const {
		page: pageParam,
		limit: limitParam,
		search,
		sort,
		state,
		country,
		city,
	} = params
	const page = pageParam ? pageParam : 1
	const limit = limitParam ? limitParam : 25

	const offset = (page - 1) * limit

	let orderBy = sql`id`
	if (sort === 'az' || sort === 'za') {
		orderBy = sql`name`
	} else if (sort === 'new' || sort === 'old') {
		orderBy = sql`date_added`
	}

	const sortOrder = sort === 'az' || sort === 'old' ? sql`ASC` : sql`DESC`

	const searchClause =
		search && search?.length > 0
			? sql`AND (name ILIKE
              ${'%' + search + '%'}
              )`
			: sql``

	const stateClause = state
		? sql`AND state =
    ${state.toUpperCase()}`
		: sql``
	const countryClause = country
		? sql`AND country_code =
            ${country.toUpperCase()}`
		: sql``
	const cityClause = city
		? sql`AND city =
    ${city.toUpperCase()}`
		: sql``

	// Fetch Resources
	const resources = (await sql`
			SELECT * 
			FROM tenant_resource
			WHERE 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause}
			ORDER BY ${orderBy} ${sortOrder} LIMIT ${limit} 
			OFFSET ${offset}
		`) as Array<Resource>

	// Fetch Total Number of Resources
	const totalResult =
		await sql`SELECT COUNT(*) as count FROM tenant_resource WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause}`
	const total = totalResult[0].count

	//Fetch Countries
	const countries =
		await sql`SELECT DISTINCT country_code FROM tenant_resource;`
	const countryList = countries.map(({ country_code }) => country_code)

	const states = await sql`
        SELECT DISTINCT state
        FROM tenant_resource
        WHERE 1 = 1 ${countryClause};
    `
	const stateList = states.map(({ state }) => state)

	// Fetch cities
	const cities = await sql`
        SELECT DISTINCT city
        FROM tenant_resource
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `
	const cityList = cities.map(({ city }) => city)

	// Return ResourcesResponse object
	return {
		resources,
		total,
		countries: countryList,
		states: stateList,
		cities: cityList,
		limit: limit,
	}
}

export async function create(inputResource: Resource): Promise<Resource> {
	try {
		return createResource(inputResource)
	} catch (e) {
		throw e
	}
}

export async function update(
	id: number,
	resource: Resource,
): Promise<Resource> {
	return updateResource(id, resource)
}

export async function deleteResource(id: number): Promise<boolean> {
	await sql`
			DELETE
			FROM tenant_resource
			WHERE id = ${id};
		`
	return true
}

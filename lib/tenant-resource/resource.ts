import { Resource, ResourcesResponse } from './models/resource'
import { createResource, updateResource } from './models/resource-data-layer'
import sql from '../db'
import { IResponse, ResourceQuery } from './types'

export async function getResources(
	params: ResourceQuery,
): Promise<ResourcesResponse> {
	const {
		page: pageNumber = 1,
		limit: limitParam = 25,
		search,
		sort,
		state,
		country,
		city,
	} = params

	const limit = limitParam ? limitParam : 25

	const offset = (pageNumber - 1) * Number(limit)

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
              ${'%' + search.toUpperCase() + '%'}
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
	const resources = (await sql`SELECT *
        FROM tenant_resource
        WHERE 1 = 1 ${searchClause} ${stateClause} ${countryClause} ${cityClause}
        ORDER BY ${orderBy} ${sortOrder} LIMIT ${limitParam}
        OFFSET ${offset}`) as Resource[]

	// Fetch Total Number of Resources
	const totalResult =
		await sql`SELECT COUNT(*) as count FROM tenant_resource WHERE 1=1 ${searchClause} ${stateClause} ${countryClause} ${cityClause}`
	const total = totalResult[0].count as number

	//Fetch Countries
	const countries =
		await sql`SELECT DISTINCT country_code FROM tenant_resource;`
	const countryList = countries.map(
		({ country_code }) => country_code as string,
	)

	const states = await sql`
        SELECT DISTINCT state
        FROM tenant_resource
        WHERE 1 = 1 ${countryClause};
    `
	const stateList = states.map(({ state }) => state as string)

	// Fetch cities
	const cities = await sql`
        SELECT DISTINCT city
        FROM tenant_resource
        WHERE 1 = 1 ${countryClause} ${stateClause};
    `
	const cityList = cities.map(({ city }) => city as string)

	// Return ResourcesResponse object
	return {
		resources,
		total,
		countries: countryList,
		states: stateList,
		cities: cityList,
		limit: limit.toString(),
	}
}

export async function create(inputResource: Resource): Promise<IResponse> {
	try {
		const resource = await createResource(inputResource)
		if (resource) return { status: 200, message: 'Created Resource' }
		throw new Error()
	} catch {
		return { status: 500, message: 'Failed to create Resource' }
	}
}

export async function update(
	id: number,
	resource: Resource,
): Promise<IResponse> {
	try {
		const updated = await updateResource(id, resource)
		if (updated) return { status: 200, message: 'Resource updated' }
		throw new Error()
	} catch {
		return { status: 500, message: 'Failed to Update Resource' }
	}
}

export async function deleteResource(id: number): Promise<IResponse> {
	try {
		const deleteResource = await sql`
			DELETE
			FROM tenant_resource
			WHERE id = ${id};
		`
		if (deleteResource) return { status: 200, message: 'Deleted Resource' }
		throw new Error()
	} catch {
		return { status: 500, message: 'Failed to Delete Resource' }
	}
}

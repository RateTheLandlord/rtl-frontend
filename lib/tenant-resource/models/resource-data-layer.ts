import { Resource } from './resource'
import sql from '@/lib/db'

export async function createResource(
	inputResource: Resource,
): Promise<Resource> {
	try {
		inputResource.name = inputResource.name
			.substring(0, 150)
			.toLocaleUpperCase()
		inputResource.country_code = inputResource.country_code.toLocaleUpperCase()
		inputResource.city = inputResource.city
			.substring(0, 150)
			.toLocaleUpperCase()
		inputResource.state = inputResource.state.toLocaleUpperCase()

		const id: number = sql<{ id: number }[]>`
					INSERT INTO tenant_resource
					(name, country_code, city, state, address, phone_number, description, href)
					VALUES
					(${inputResource.name}, ${inputResource.country_code}, ${inputResource.city}, ${
			inputResource.state
		},
					 ${inputResource.address || ''}, ${inputResource.phone_number || ''}, ${
			inputResource.description
		}, ${inputResource.href})
					RETURNING id;
				`[0].id

		inputResource.id = id

		return inputResource
	} catch (e) {
		throw e
	}
}

export async function updateResource(
	id: number,
	resource: Resource,
): Promise<Resource> {
	await sql`
				UPDATE tenant_resource 
				SET name = ${resource.name}, 
				country_code = ${resource.country_code}, 
				city = ${resource.city}, 
				state = ${resource.state},
				address = ${resource.address || ''}, 
				phone_number = ${resource.phone_number || ''}, 
				description = ${resource.description}, 
				href = ${resource.href}
				WHERE id = ${id};
			`
	return resource
}

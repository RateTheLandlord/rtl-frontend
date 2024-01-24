exports.up = async function (DB) {
	const tableExists = await DB`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'tenant_resource'
        )`
	if (!tableExists[0].exists) {
		await DB`
            CREATE TABLE tenant_resource (
                id SERIAL PRIMARY KEY,
                name TEXT,
                country_code VARCHAR(2),
                city TEXT,
                state TEXT,
                address TEXT,
                phone_number TEXT,
                date_added TIMESTAMP DEFAULT now(),
                description TEXT,
                href TEXT
            );
    `
	}
}

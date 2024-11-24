exports.up = async function (DB) {
	const tableExists = await DB`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'spam_landlords'
  )`
	if (!tableExists[0].exists) {
		await DB`
      CREATE TABLE spam_landlords (
        id SERIAL PRIMARY KEY, 
        landlord TEXT,
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `
	}
}

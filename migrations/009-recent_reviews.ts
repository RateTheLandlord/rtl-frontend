exports.up = async function (DB) {
	const tableExists = await DB`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'recent_review'
  )`
	if (!tableExists[0].exists) {
		await DB`
      CREATE TABLE recent_review (
        id SERIAL PRIMARY KEY, 
        landlord TEXT, 
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `
	}
}

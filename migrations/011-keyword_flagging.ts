exports.up = async function (DB) {
	const tableExists = await DB`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'keyword_flags'
  )`
	if (!tableExists[0].exists) {
		await DB`
      CREATE TABLE keyword_flags (
        id SERIAL PRIMARY KEY, 
        keyword TEXT,
        reason TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `
	}
}

exports.up = async function (DB) {
	const tableExists = await DB`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'us_location'
  )`
	if (!tableExists[0].exists) {
		await DB`
      CREATE TABLE us_location (
        zip TEXT PRIMARY KEY, 
        latitude TEXT, 
        longitude TEXT
      );
    `
	}
}

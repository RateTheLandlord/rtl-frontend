exports.up = async function (DB) {
	const tableExists = await DB`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'review'
  )`
	if (!tableExists[0].exists) {
		await DB`
      CREATE TABLE review (
        id SERIAL PRIMARY KEY, 
        landlord TEXT, 
        country_code VARCHAR(2),
        city TEXT,
        state TEXT,
        zip TEXT,
        review TEXT,
        repair numeric CHECK (repair >= 1 AND repair <= 5),
        health numeric CHECK (health >= 1 AND health <= 5),
        stability numeric CHECK (stability >= 1 AND stability <= 5),
        privacy numeric CHECK (privacy >= 1 AND privacy <= 5),
        respect numeric CHECK (respect >= 1 AND respect <= 5),
        date_added TIMESTAMP DEFAULT now(),
        flagged BOOLEAN,
        flagged_reason TEXT,
        admin_approved BOOLEAN,
        admin_edited BOOLEAN
      );
    `
	}
}

export {}

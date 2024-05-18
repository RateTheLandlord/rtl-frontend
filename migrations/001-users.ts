exports.up = async function (DB) {
	const tableExists = await DB`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'users'
  )`
	if (!tableExists[0].exists) {
		await DB`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY, 
        name TEXT,
        email TEXT NOT NULL,
        password TEXT,
        blocked BOOLEAN,
        role TEXT,
        UNIQUE (email),
        login_attempts numeric DEFAULT 0,
        login_lockout BOOLEAN,
        last_login_attempt TIMESTAMP DEFAULT now(),
        lockout_time TIMESTAMP DEFAULT now()
      );
    `
	}
}


/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '.env' })
if (process.env.DATABASE_URL) {

    const { parse } = require('pg-connection-string');
  
    const options = parse(process.env.DATABASE_URL);

    process.env.PGHOST = options.host;
    process.env.PGDATABASE = options.database;
    process.env.PGUSERNAME = options.user;
    process.env.PGPASSWORD = options.password
  }

  

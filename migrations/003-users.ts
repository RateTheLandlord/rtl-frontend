exports.up = async function (DB) {
	await DB`
    ALTER TABLE users
    DROP COLUMN IF EXISTS password,
    DROP COLUMN IF EXISTS blocked,
    DROP COLUMN IF EXISTS login_attempts,
    DROP COLUMN IF EXISTS login_lockout,
    DROP COLUMN IF EXISTS last_login_attempt,
    DROP COLUMN IF EXISTS lockout_time;
    `
}

exports.up = async function (DB) {
	await DB`
    ALTER TABLE review
    ADD COLUMN user_code TEXT DEFAULT NULL,
    ADD COLUMN last_user_attempt TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN number_user_attempts numeric DEFAULT 0,
    ADD COLUMN number_user_edits numeric DEFAULT 0,
    ADD COLUMN has_user_code boolean GENERATED ALWAYS AS (
    user_code IS NOT NULL
    ) STORED,
    `
}

exports.up = async function (DB) {
	await DB`
    ALTER TABLE review
    ADD COLUMN delete_date TEXT;
    ADD COLUMN delete_reason TEXT;
    ADD COLUMN deleter TEXT[];
    `
}

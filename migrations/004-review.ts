exports.up = async function (DB) {
	await DB`
    ALTER TABLE review
    ADD COLUMN rent numeric DEFAULT NULL;
    `
}

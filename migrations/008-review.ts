exports.up = async function (DB) {
	await DB`
    ALTER TABLE review
    ADD COLUMN moderator TEXT[];
    `
}

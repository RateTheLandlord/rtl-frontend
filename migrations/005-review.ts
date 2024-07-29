exports.up = async function (DB) {
	await DB`
    ALTER TABLE review
    ADD COLUMN moderation_reason TEXT DEFAULT NULL;
    `
}

exports.up = async function (DB) {
	await DB`
    ALTER TABLE review
    ADD COLUMN suspicious_reason VARCHAR(255) DEFAULT NULL,
    ;`
}

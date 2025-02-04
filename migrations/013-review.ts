exports.up = async function (DB) {
	await DB`
    ALTER TABLE review
    ADD COLUMN restore_date TEXT,
    ADD COLUMN restore_reason TEXT,
    ADD COLUMN restored_by TEXT[];
    `
}

const db = require("../../db/queries")

exports.getByTelegram = async (tgId) => {
    const { rows } = await db.query(
        "SELECT * FROM users WHERE telegram_id = $1",
        [tgId]
    )

    return rows[0]
}

exports.create = async (tgId) => {
    const { rows } = await db.query(`
        INSERT INTO users (telegram_id, plan, created_at)
        VALUES ($1, 'free', NOW())
        RETURNING *
    `, [tgId])

    return rows[0]
}

exports.count = async () => {
    const { rows } = await db.query("SELECT COUNT(*)::int FROM users")
    return rows[0].count
}

exports.setPlan = async (id, plan) => {
    await db.query(
        "UPDATE users SET plan = $1 WHERE telegram_id = $2",
        [plan, id]
    )
}
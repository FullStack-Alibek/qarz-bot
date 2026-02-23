const pool = require("../db")

exports.getUser = async (telegramId) => {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE telegram_id=$1",
        [telegramId]
    )

    return rows[0]
}

exports.createUser = async (telegramId, name) => {
    await pool.query(
        `INSERT INTO users (telegram_id, client_name, plan)
        VALUES ($1, $2, 'free')`,
        [telegramId, name]
    )
}
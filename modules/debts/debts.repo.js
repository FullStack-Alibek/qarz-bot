const pool = require("../../core/database")

exports.create = async ({ userId, name, amount, dueDate }) => {
    const { rows } = await pool.query(
        `INSERT INTO debts (user_id, client_name, amount, due_date)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, name, amount, dueDate]
    )

    return rows[0]
}

exports.getByUser = async (userId) => {
    const { rows } = await pool.query(
        `SELECT id, client_name, amount
         FROM debts
         WHERE user_id = $1
         ORDER BY id DESC`,
        [userId]
    )
    return rows
}

exports.getStats = async (userId) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*)::int as count,
                COALESCE(SUM(amount),0)::bigint as sum
         FROM debts WHERE user_id = $1`,
        [userId]
    )

    return rows[0]
}

exports.globalStats = async () => {
    const { rows } = await pool.query(`
        SELECT COUNT(*)::int as count,
                COALESCE(SUM(amount), 0)::bigint as sum
        FROM debts
    `)

    return rows[0]
}

exports.getByTelegram = async (telegramId) => {
    const { rows } = await pool.query(`
        SELECT d.client_name, d.amount
        FROM debts d
        JOIN users u ON u.id = d.user_id
        WHERE u.telegram_id = $1
        ORDER BY d.id DESC
    `, [telegramId])

    return rows
}

exports.deleteDebt = async(id) => {
    await pool.query("DELETE FROM debts WHERE id = $1", [id])
}
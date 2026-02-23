const pool = require("../db")

exports.addDebt = async (userID, name, amount) => {
    await pool.query(
        `INSERT INTO debts(user_id, client_name, amount)
        VALUES ($1, $2, $3)`,
        [userID, name, amount]
    )
}

exports.countDebts = async (userID) => {
    const { rows } = await pool.query(
        "SELECT COUNT(*) FROM debts WHERE user_id=$1",
        [userID]
    )
    return Number(rows[0].count)
}
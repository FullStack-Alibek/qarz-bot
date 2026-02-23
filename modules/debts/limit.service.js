const plans = require("../../config/plans")
const pool = require("../../db/queries")

exports.canAddDebt = async (user) => {
    const plan = plans[user.plan] || plans.free

    if(plan.maxDebts === Infinity) {
        return { allowed: true }
    }
    const { rows } = await pool.query(
        "SELECT COUNT(*) FROM debts WHERE user_id = $1",
        [user.id]
    )

    const count = Number(rows[0].count)

    return {
        allowed: count < plan.maxDebts,
        current: count,
        limit: plan.maxDebts
    }
}
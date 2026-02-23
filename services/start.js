const pool = require("../config/db")

module.exports = async (ctx) => {
    const telegramId = ctx.from.id
    const name = ctx.from.first_name

    try {
        const exists = await pool.query(
            "SELECT * FROM users WHERE telegram_id = $1",
            [telegramId]
        )

        if (!exists.rows.length) {
            await pool.query(
                "INSERT INTO users (telegram_id, client_name) VALUES ($1, $2)",
                [telegramId, name]
            )
        }

        ctx.reply("✅ Ro'yxatdan o'tdingiz!\nEndi qarz qo'shishingiz mumkin.")
    } catch (err) {
        console.error(err)
        ctx.reply("Xatolik yuz berdi")
    }
}
const pool = require("./database")

module.exports = (bot) => {
    setInterval(async () => {
        try {
            const { rows } = await pool.query(`
                SELECT u.telegram_id, d.client_name, d.amount, d.created_at
                FROM debts d
                JOIN users u ON u.id = d.user_id
                WHERE u.plan IN ('vip', 'premium')
                AND d.created_at < NOW() - INTERVAL '3 days'
                `)

            if (user.plan === "premium") {
                text += "\n📊 Premium maslahat: Excel export orqali tahlil qiling"
            }

            for (const row of rows) {
                const formatted = new Intl.NumberFormat("uz-UZ").format(row.amount)

                await bot.telegram.sendMessage(
                    row.telegram_id,
                    `⏰ Eslatma

                        💰 ${row.client_name} sizga ${formatted} so'm qarz.
                        Qarzni eslatishni unutmang.
                        
                        ⚡ Qarz nazorati = pul nazorati`
                )
            }

            console.log("Reminder run: ", rows.length)
        } catch (error) {
            console.log("Reminder run: ", error.message)
        }
    }, 1000 * 60 * 60 * 24)
}
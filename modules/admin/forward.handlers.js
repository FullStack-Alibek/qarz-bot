const { Markup } = require("telegraf")

const ADMIN_ID = Number(process.env.ADMIN_ID)

module.exports = (bot) => {

    bot.on("photo", async (ctx) => {
        const user = ctx.from

        const caption = `
📸 Yangi chek!

👤 ${user.first_name}
🆔 ID: ${user.id}
🔗 @${user.username || "yo‘q"}
        `

        await ctx.telegram.sendPhoto(
            ADMIN_ID,
            ctx.message.photo.at(-1).file_id,
            {
                caption,
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback("💎 VIP", `give_vip_${user.id}`),
                        Markup.button.callback("🚀 Premium", `give_premium_${user.id}`)
                    ],
                    [
                        Markup.button.callback("👑 Lifetime", `give_lifetime_${user.id}`)
                    ]
                ])
            }
        )

        await ctx.reply("✅ Chek qabul qilindi")
    })
}
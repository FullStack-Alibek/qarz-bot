const service = require("./users.service")
const { mainKeyboard } = require("../menu/menu.keyboards")

const ADMIN_ID = Number(process.env.ADMIN_ID) 

module.exports = (bot) => {

    bot.command("myid", (ctx) => {
        ctx.reply("Sizning ID: " + ctx.from.id)
    })

    bot.command("admin", (ctx) => {
        if (ctx.from.id !== ADMIN_ID) {
            return ctx.reply("❌ Siz admin emassiz")
        }

        ctx.reply("👑 Adminsiz!")
    })

    bot.start(async (ctx) => {
        const user = await service.getOrCreate(ctx.from.id)

        await ctx.reply(`
👋 Xush kelibsiz!

📦 Sizning tarifingiz: ${user.plan.toUpperCase()}

Qarzlarni nazorat qiling va foydani oshiring 📈

━━━━━━━━━━
⚡ QarzNazorat Bot
        `, mainKeyboard)

        ctx.reply("📊 Statistika bo'limini ko'rib turing 😉")
    })
}
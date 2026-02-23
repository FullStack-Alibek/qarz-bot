const service = require("./users.service")
const { mainKeyboard } = require("../menu/menu.keyboards")

module.exports = (bot) => {
    bot.command("myid", (ctx) => {
        ctx.reply("Sizning ID: " + ctx.from.id)
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

        ctx.reply("📊 Statistika bo‘limini ko‘rib turing 😉")
    })
}
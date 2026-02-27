const userRepo = require("../users/users.repo")
const debtsRepo = require("../debts/debts.repo")

const ADMIN_ID = Number(process.env.ADMIN_ID)

module.exports = (bot) => {
    const isAdmin = (ctx) => ctx.from.id === ADMIN_ID

    bot.command("admin", async (ctx) => {
        if (!isAdmin(ctx)) return ctx.reply("❌ Siz admin emassiz")

        const users = await userRepo.count()
        const stats = await debtsRepo.globalStats()

        ctx.reply(`
👑 Admin panel

👥 Users: ${users}
📊 Qarzlar: ${stats.count}
💰 Summa: ${stats.sum} so'm
        `)
    })

    bot.command("vip", async (ctx) => {
        if (!isAdmin(ctx)) return ctx.reply("❌ Admin emassiz")
        if (!ctx.message.reply_to_message)
            return ctx.reply("User xabariga reply qiling")

        const id = ctx.message.reply_to_message.from.id
        await userRepo.setPlan(id, "vip")

        ctx.reply(`✅ VIP berildi\nID: ${id}`)
    })

    bot.command("premium", async (ctx) => {
        if (!isAdmin(ctx)) return ctx.reply("❌ Admin emassiz")
        if (!ctx.message.reply_to_message)
            return ctx.reply("User xabariga reply qiling")

        const id = ctx.message.reply_to_message.from.id
        await userRepo.setPlan(id, "premium")

        ctx.reply(`🚀 Premium berildi\nID: ${id}`)
    })

    bot.command("lifetime", async (ctx) => {
        if (!isAdmin(ctx)) return ctx.reply("❌ Admin emassiz")
        if (!ctx.message.reply_to_message)
            return ctx.reply("User xabariga reply qiling")

        const id = ctx.message.reply_to_message.from.id
        await userRepo.setPlan(id, "lifetime")

        ctx.reply(`👑 Lifetime berildi\nID: ${id}`)
    })
}
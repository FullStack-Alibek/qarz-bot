    const userRepo = require("../users/users.repo")
    const debtsRepo = require("../debts/debts.repo")

    const ADMIN_id = Number(process.env.ADMIN_ID)

    module.exports = (bot) => {
        const isAdmin = (ctx) => ctx.from.id === ADMIN_id

        bot.command("admin", async (ctx) => {
            if (!isAdmin(ctx)) {
                return ctx.reply("❌ Admin emassan")
            }

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

            if (!ctx.message.reply_to_message) {
                return ctx.reply("User xabariga reply qiling")
            }

            const targetId = ctx.message.reply_to_message.from.id

            await userRepo.setPlan(targetId, "vip")

            ctx.reply(`✅ Vip berildi\nID: ${targetId}`)
        })

        bot.command("premium", async (ctx) => {
            if (!isAdmin(ctx)) return ctx.reply("❌ Admin emassiz")

            if (!ctx.message.reply_to_message) {
                return ctx.reply("User xabariga reply qiling")
            }

            const targetId = ctx.message.reply_to_message.from.id

            await userRepo.setPlan(targetId, "premium")

            ctx.reply(`✅ Premium berildi\nID: ${targetId}`)
        })
    }
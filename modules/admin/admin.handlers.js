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
        await givePlan(bot, id, "vip", ctx)
    })

    bot.command("premium", async (ctx) => {
        if (!isAdmin(ctx)) return ctx.reply("❌ Admin emassiz")
        if (!ctx.message.reply_to_message)
            return ctx.reply("User xabariga reply qiling")

        const id = ctx.message.reply_to_message.from.id
        await givePlan(bot, id, "premium", ctx)
    })

    bot.command("lifetime", async (ctx) => {
        if (!isAdmin(ctx)) return ctx.reply("❌ Admin emassiz")
        if (!ctx.message.reply_to_message)
            return ctx.reply("User xabariga reply qiling")

        const id = ctx.message.reply_to_message.from.id
        await givePlan(bot, id, "lifetime", ctx)
    })

    bot.action(/give_vip_(.+)/, async (ctx) => {
        const id = ctx.match[1]
        await givePlan(bot, id, "vip", ctx, true)
    })

    bot.action(/give_premium_(.+)/, async (ctx) => {
        const id = ctx.match[1]
        await givePlan(bot, id, "premium", ctx, true)
    })

    bot.action(/give_lifetime_(.+)/, async (ctx) => {
        const id = ctx.match[1]
        await givePlan(bot, id, "lifetime", ctx, true)
    })
}

async function givePlan(bot, userId, plan, ctx, fromButton = false) {
    await userRepo.setPlan(userId, plan)

    const messages = {
        vip: `🎉 Tabriklaymiz!\nSizga VIP aktiv qilindi 💎`,
        premium: `🚀 Tabriklaymiz!\nSizga PREMIUM aktiv qilindi`,
        lifetime: `👑 TABRIKLAYMIZ!\nSiz Founder Lifetime oldingiz!`
    }

    await bot.telegram.sendMessage(userId, messages[plan])

    if (fromButton) {
        await ctx.editMessageCaption(`✅ ${plan.toUpperCase()} berildi`)
    } else {
        await ctx.reply(`✅ ${plan.toUpperCase()} berildi\nID: ${userId}`)
    }
}
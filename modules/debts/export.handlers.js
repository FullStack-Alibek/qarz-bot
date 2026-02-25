const userRepo = require("../users/users.repo")
const generateUserExcel = require("./export.service")
const { clearState } = require("../../core/state")

module.exports = (bot) => {
    bot.hears("📥 Excel export", async (ctx) => {
        clearState(ctx.from.id)

        const user = await userRepo.getByTelegram(ctx.from.id)

        const plan = (user.plan || "").toLowerCase()

        if (!["premium", "lifetime"].includes(plan)) {
            return ctx.reply("❌ Excel export faqat Premium va Lifetime da")
        }

        const file = await generateUserExcel(user.telegram_id)

        await ctx.replyWithDocument({
            source: file,
            filename: "qarzlar.xlsx"
        })
    })
}
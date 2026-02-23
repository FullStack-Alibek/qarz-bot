const userRepo = require("../users/users.repo")
const generateUserExcel = require("./export.service")
const { clearState } = require("../../core/state")

module.exports = (bot) => {
    bot.hears("📥 Excel export", async (ctx) => {
        clearState(ctx.from.id)
        const user = await userRepo.getByTelegram(ctx.from.id)

        if (user.plan !== "premium") {
            return ctx.reply("❌ Excel export faqat Premium da")
        }

        const file = await generateUserExcel(user.telegram_id)

        await ctx.replyWithDocument({
            source: file,
            filename: "qarzlar.xlsx"
        })
    })
}
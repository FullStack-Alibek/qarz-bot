const { mainKeyboard, plansInline } = require("./menu.keyboards")
const debtsService = require("../debts/debts.service")
const userRepo = require("../users/users.repo")
const excelService = require("../debts/export.service")
const { clearState } = require("../../core/state")
const { Markup } = require("telegraf")

module.exports = (bot) => {

    bot.start(async (ctx) => {
        const user = await userRepo.getOrCreate(ctx.from.id)
        ctx.reply(`Salom 👋 Plan: ${user.plan}`, mainKeyboard)
    })

    bot.hears(/Mening qarzlarim/i, async (ctx) => {
        const user = await userRepo.getByTelegram(ctx.from.id)
        const debts = await debtsService.getUserDebts(user.id)

        if (!debts.length) return ctx.reply("📭 Qarzlar yo‘q")

        let total = 0

        for (const d of debts) {
            total += Number(d.amount)
            const formatted = new Intl.NumberFormat("uz-UZ").format(d.amount)

            await ctx.reply(
                `👤 ${d.client_name}\n💰 ${formatted} so'm`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("❌ O‘chirish", `delete_${d.id}`)]
                ])
            )
        }

        const totalFormatted = new Intl.NumberFormat("uz-UZ").format(total)
        await ctx.reply(`💰 Jami: ${totalFormatted} so'm`)
    })

    bot.hears(/Statistika/i, async (ctx) => {
        const user = await userRepo.getByTelegram(ctx.from.id)
        const stats = await debtsService.getUserStats(user.id)

        const count = stats.count || 0
        const sum = stats.sum || 0
        const formatted = new Intl.NumberFormat("uz-UZ").format(sum)

        let mood = "🟢 Zo'r"
        if (sum > 1000000) mood = "🟡 O'rtacha"
        if (sum > 5000000) mood = "🔴 Xavfli"

        ctx.reply(`
📊 Sizning statistikangiz

📋 Qarzdorlar soni: ${count} ta
💰 Umumiy summa: ${formatted} so'm

📈 Holat: ${mood}
━━━━━━━━━━━━━━━━━━━━━━
💡 Qarzni kamaytirish = foyda oshishi
        `)
    })

    bot.hears(/Tariflar/i, (ctx) => {
        clearState(ctx.from.id)
        ctx.reply(`
⭐ Tariflar

💎 VIP — 39 000 so'm / oy
• Cheksiz qarz
• Reminder
• Statistika

🚀 Premium — 69 000 so'm / oy
• VIP hammasi
• Excel export

👑 Lifetime — 199 000 so'm
• Umrbod Premium

🔥 Launch narxlar (keyin oshadi)
        `, plansInline)
    })

    bot.hears(/To'lov qilish/i, (ctx) => {
        ctx.reply(`
💳 To'lov uchun karta:
6262 5707 8571 6129

📸 To'lovdan keyin chek yuboring
Admin tarifni aktiv qiladi
        `)
    })

    bot.hears(/Excel export/i, async (ctx) => {
        const user = await userRepo.getByTelegram(ctx.from.id)

        if (!["premium", "lifetime"].includes(user.plan)) {
            return ctx.reply("❌ Excel export faqat Premium va Lifetime da")
        }

        const buffer = await excelService.generateUserExcel(user.id)

        await ctx.replyWithDocument({
            source: buffer,
            filename: "qarzlar.xlsx"
        })
    })

    bot.action("buy_vip", (ctx) => {
        ctx.answerCbQuery()
        ctx.reply(`
💎 VIP — 39 000 so'm / oy

• Cheksiz qarz
• Statistika
• Reminder

💳 To'lov:
6262 5707 8571 6129

📸 Chek yuboring — aktiv qilamiz
        `)
    })

    bot.action("buy_premium", (ctx) => {
        ctx.answerCbQuery()
        ctx.reply(`
🚀 Premium — 69 000 so'm / oy

VIP + Excel export

💳 To'lov:
6262 5707 8571 6129

📸 Chek yuboring — darhol aktiv
        `)
    })

    bot.action("buy_lifetime", (ctx) => {
        ctx.answerCbQuery()
        ctx.reply(`
👑 Lifetime — 199 000 so'm

🔥 Umrbod Premium

💳 To'lov:
6262 5707 8571 6129

📸 Chek yuboring — founder qilamiz
        `)
    })

    bot.action(/delete_(.+)/, async (ctx) => {
        try {
            const debtId = ctx.match[1]
            await debtsService.deleteDebt(debtId)

            await ctx.answerCbQuery("🗑 O'chirildi")
            await ctx.editMessageText("❌ Qarz o'chirildi")
        } catch (err) {
            console.error(err)
            await ctx.answerCbQuery("Xatolik")
        }
    })
}
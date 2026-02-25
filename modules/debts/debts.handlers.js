const { setState, getState, clearState } = require("../../core/state")
const { canAddDebt } = require("./limit.service")
const { limitReachedText } = require("../payments/upsell")
const userRepo = require("../users/users.repo")
const debtsService = require("./debts.service")

module.exports = (bot) => {
    bot.hears("➕ Qarz qo'shish", async (ctx) => {
        const user = await userRepo.getByTelegram(ctx.from.id)

        if (!user) {
            return ctx.reply("User topilmadi /start bosing")
        }

        const limitCheck = await canAddDebt(user)

        if (!limitCheck.allowed) {
            return ctx.reply(limitReachedText(user.plan))
        }

        setState(ctx.from.id, { step: "name" })
        ctx.reply("👤 Ism kiriting: ")
    })

    bot.on("text", async (ctx, next) => {
        const state = getState(ctx.from.id)
        if (!state) return next()

        const text = ctx.message.text

        if (state.step === 'name') {
            state.name = text
            state.step = "amount"
            setState(ctx.from.id, state)
            return ctx.reply("💰 Summa kiriting:")
        }

        if (state.step === "amount") {
            const amount = Number(text.replace(/\D/g, ""))
            if (!amount) return ctx.reply("Raqam yozing")

            if (amount > 100_000_000) {
                return ctx.reply("❌ Juda katta summa")
            }

            state.amount = amount
            state.step = "date"
            setState(ctx.from.id, state)

            return ctx.reply("📅 Qarz muddati (YYYY-MM-DD):")
        }

        if (state.step === "date") {
            const input = text.trim()

            const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(input)

            if (!isValidFormat) {
                return ctx.reply("❌ Sana noto'g'ri format\nMasalan: 2026-03-31")
            }

            const dueDate = new Date(input)

            if (isNaN(dueDate.getTime())) {
                return ctx.reply("❌ Noto'g'ri sana")
            }

            const user = await userRepo.getByTelegram(ctx.from.id)

            await debtsService.addDebt({
                userId: user.id,
                name: state.name,
                amount: state.amount,
                dueDate: input
            })

            const formatted = new Intl.NumberFormat("uz-UZ").format(state.amount)

            clearState(ctx.from.id)

            return ctx.reply(`
        ✅ Qarz qo'shildi
        
        👤 ${state.name}
        💰 ${formatted} so'm
        📅 ${input}
        
        ━━━━━━━━━━
        📊 Statistika bo'limida ko'ring
        `)
        }
    })

    bot.action(/delete_(.+)/, async (ctx) => {
        const debtId = ctx.match[1]

        await debtsService.deleteDebt(debtId)

        Markup.inlineKeyboard([
            [Markup.button.callback("⚠️ Ha, o'chir", `delete_${d.id}`)],
            [Markup.button.callback("Bekor", "cancel")]
        ])
    })
}
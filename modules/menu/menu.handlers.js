const { mainKeyboard, plansInline } = require("./menu.keyboards")
const debtsService = require("../debts/debts.service")
const userRepo = require("../users/users.repo")
const excelService = require("../debts/export.service")
const { clearState } = require("../../core/state")

module.exports = (bot) => {
    bot.start(async (ctx) => {
        const user = await userRepo.getOrCreate(ctx.from.id)
        ctx.reply(`Salom 👋 Plan: ${user.plan}`, mainKeyboard)
    })

    bot.hears("📋 Mening qarzlarim", async (ctx) => {
        const user = await userRepo.getByTelegram(ctx.from.id)
        const debts = await debtsService.getUserDebts(user.id)

        if (!debts.length) {
            return ctx.reply(`
        📭 Sizda hali qarzlar yo'q
        
        ➕ Birinchi qarzni qo'shing
        va statistikani kuzating.
        
        💡 Qarz nazorati = pul nazorati
            `)
        }

        let total = 0

        const list = debts.map((d, i) => {
            total += Number(d.amount)
            const formatted = new Intl.NumberFormat("uz-UZ").format(d.amount)
            return `${i + 1}. ${d.client_name} — ${formatted} so'm`
        }).join("\n")

        const totalFormatted = new Intl.NumberFormat("uz-UZ").format(total)

        ctx.reply(`
        📋 Mening qarzlarim
            
            ${list}
            
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            💰 Jami: ${totalFormatted} so'm
        `)
    })


    bot.hears("📊 Statistika", async (ctx) => {
        const user = await userRepo.getByTelegram(ctx.from.id)
        const stats = await debtsService.getUserStats(user.id)

        const count = stats.count || 0
        const sum = stats.sum || 0
        const formatted = new Intl.NumberFormat("uz-UZ").format(sum)


        let mood = "🟢 Zo'r"
        if (sum > 1000000) mood = "🟡 O'rtacha"
        if (sum > 5000000) mood = "🔴 Xavfli"

        ctx.reply(
            `
                📊 Sizning statistikangiz
                
                📋 Qarzdorlar soni: ${count} ta
                💰 Umumiy summa: ${formatted} so'm


                📈 Holat: ${mood}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                💡 Qarzlarni kamaytirish = foyda oshishi

            `)
    })

    bot.hears("⭐ Tariflar", (ctx) => {
        clearState(ctx.from.id)
        ctx.reply(`
    ⭐ Tariflar
    
    💎 VIP — 39 000 so'm / oy
    • Cheksiz qarz qo'shish
    • Reminder
    • Statistika
    
    🚀 Premium — 69 000 so'm / oy
    • VIP hammasi
    • Excel export
    
    👑 Lifetime — 199 000 so'm
    • Umrbod Premium
    • Bir marta to'lov
    
    🔥 Launch narxlar (keyin oshadi)
        `, plansInline)
    })

    bot.hears("💳 To'lov qilish", (ctx) => {
        ctx.reply(`
            💳 To'lov uchun karta:
            0000 0000 0000 0000
            
            To'lovdan keyin:
            📸 To'lov chekini yuboring
            Admin sizga tarif beradi
        `)
    })

    bot.hears("📤 Excel export", async (ctx) => {
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

📈 Qarzingizni nazorat qiling va pulni yo'qotmang

Nimalar bor:
• Cheksiz qarz qo'shish
• Qarz statistikasi
• Qarzdorlarni eslatish (Reminder)
• Tez va qulay ishlash

💳 To'lov:
0000 0000 0000 0000

📸 Chek yuboring — 5 daqiqada aktiv qilamiz
        `)
    })

    bot.action("buy_premium", (ctx) => {
        ctx.answerCbQuery()
        ctx.reply(`
    🚀 Premium — 69 000 so'm / oy

Biznes egalari uchun TOP tarif 🔥

VIP + qo'shimcha:
• 📥 Excel export
• Hisobotlarni saqlash
• Katta savdo uchun ideal

💡 Agar qarzlar ko'p bo'lsa — Premium oling

💳 To'lov:
0000 0000 0000 0000

📸 Chek yuboring — darhol aktiv qilamiz
        `)
    })

    bot.action("buy_lifetime", (ctx) => {
        ctx.answerCbQuery()
        ctx.reply(`
    👑 Founder Lifetime — 199 000 so'm

🔥 Bir marta to'lov — umrbod Premium

Nimalar olasiz:
• 🚀 Premium barcha funksiyalar
• 📥 Excel export
• 🔮 Kelajakdagi barcha yangilanishlar BEPUL
• 💎 Founder badge

💡 1 martalik to'lov = abadiy xotirjamlik

💳 To'lov:
0000 0000 0000 0000

📸 Chek yuboring — founder sifatida qo'shamiz

⏳ Launch narxi — keyin qimmatlashadi
        `)
    })
}
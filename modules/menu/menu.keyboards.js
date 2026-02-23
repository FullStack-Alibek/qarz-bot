const { Markup } = require("telegraf")

exports.mainKeyboard = Markup.keyboard([
    ["➕ Qarz qo'shish", "📋 Mening qarzlarim"],
    ["📊 Statistika", "⭐ Tariflar"],
    ["💳 To'lov qilish", "📥 Excel export"]
]).resize()

exports.plansInline = Markup.inlineKeyboard([
    [Markup.button.callback("💎 VIP", "buy_vip")],
    [Markup.button.callback("🚀 PREMIUM", "buy_premium")],
    [Markup.button.callback("👑 LIFETIME", "buy_lifetime")],
])
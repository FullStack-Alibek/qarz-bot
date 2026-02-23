const debtService = require("../../services/debt.service")

module.exports = async (ctx) => {
    ctx.session = { step: "name" }
    ctx.reply("👤 Ism:");
}
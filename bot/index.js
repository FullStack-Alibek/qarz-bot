const { Telegraf } = require("telegraf")
const start = require("./handlers/start")
const addDebt = require("./handlers/addDebt")

const auth = require("./middlewares/auth")

module.exports = (bot) => {
    bot.start(start)

    bot.hears("➕ Qarzdor qo'shish", auth, addDebt);
}
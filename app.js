require("dotenv").config()
const { Telegraf } = require("telegraf")
const reminder = require("./core/reminder")

const registerBot = require("./bot")
const registerAdmin = require("./admin")

const bot = new Telegraf(process.env.BOT_TOKEN)

registerBot(bot)
registerAdmin(bot)
reminder(bot)

bot.launch()

console.log("Bot ishlayapti")
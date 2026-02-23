const { Telegraf } = require("telegraf")
const { BOT_TOKEN } = require("./core/env")
const logger = require("./core/logger")

const registerHandlers = require("./modules")

const bot = new Telegraf(BOT_TOKEN)

require("./core/rateLimit")(bot)
require("./core/reminder")(bot)

bot.use((ctx, next) => {
    if(ctx.chat.type !== "private") {
        return ctx.reply("❌ Bot faqat shaxsiy chatda ishlaydi")
    }

    return next()
})

bot.command("myid", (ctx) => {
    ctx.reply("Sizning ID: " + ctx.from.id)
})  

registerHandlers(bot)

bot.launch().then(() => logger.info("🤖 Bot started"))

process.on("unhandledRejection", (e) => {
    console.error("UNHANDLED:", e)
})

process.on("uncaughtException", (e) => {
    console.error("CRASH:", e)
})

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
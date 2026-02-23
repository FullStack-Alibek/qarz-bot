module.exports = (bot) => {
    bot.command("stats", async (ctx) => {
        if(ctx.from.id != process.env.ADMIN_ID) return

        ctx.reply("📊 Admin panel")
    })
}
const last = new Map()

module.exports = (bot) => {
    bot.use((ctx, next) => {
        if (!ctx.from) return next()

        if(ctx.callbackQuery) return next()

        const now = Date.now()
        const prev = last.get(ctx.from.id) || 0

        if (now - prev < 1500) {
            return ctx.reply("⏳ Sekinroq yozing")
        }

        last.set(ctx.from.id, now)
        return next()
    })
}
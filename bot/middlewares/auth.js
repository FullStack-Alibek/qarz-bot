const userService = require("../../services/user.service")

module.exports = async (ctx, next) => {
    const user = await userService.getUser(ctx.from.id)

    if(!user) {
        return ctx.reply("Avval /start bosing")
    }

    ctx.user = user
    return next()
}
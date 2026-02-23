const userService = require("../../services/user.service")

module.exports = async (ctx) => {
    const id = ctx.from.id
    const name = ctx.from.first_name

    let user = await userService.getUser(id)

    if(!user) {
        await userService.createUser(id, name)
        return ctx.reply("🎉 Xush kelibsiz!");
    }

    ctx.reply("👋 Qaytganingizdan xursandmiz");
}
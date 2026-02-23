const PLANS = require("../../config/plans")

module.exports = (requiredPlan) => {
    return async (ctx, next) => {
        const userPlan = ctx.user.plan

        const order = ["free", "vip", "premium"]

        if (order.indexOf(userPlan) < order.indexOf(requiredPlan)) {
            return ctx.reply("🔒 Bu funksiya premiumda")
        }

        ctx.plan = PLANS[userPlan]
        return next()
    }
}
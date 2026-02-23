const LIMITS = {
    free: 10,
    vip: 100,
    premium: Infinity
}

module.exports = {
    canAddDebt(plan, count) {
        return count < LIMITS[plan]
    }
}
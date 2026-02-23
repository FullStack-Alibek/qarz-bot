module.exports = {
    free: {
        maxDebts: 25,
        export: false,
        reminders: false,
    },

    vip: {
        maxDebts: 250,
        export: false,
        reminders: true,
    },
    premium: {
        maxDebts: Infinity,
        export: true,
        reminders: true
    },
}
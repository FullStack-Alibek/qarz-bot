const repo = require("./debts.repo")

exports.addDebt = async ({userId, name, amount, dueDate}) => {
    return repo.create({
        userId,
        name,
        amount,
        dueDate
    })
}

exports.getUserDebts = (userId) => repo.getByUser(userId)

exports.getUserStats = (userId) => repo.getStats(userId)
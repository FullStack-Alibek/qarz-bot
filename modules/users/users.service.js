const repo = require("./users.repo")

exports.getOrCreate = async (tgId) => {
    let user = await repo.getByTelegram(tgId)
    if (!user) user = await repo.create(tgId)
    return user
}
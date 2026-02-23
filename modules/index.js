const users = require("./users/users.handlers")
const debts = require("./debts/debts.handlers")
const menu = require("./menu/menu.handlers")
const admin = require("./admin/admin.handlers")
const exportExcel = require("./debts/export.handlers")

module.exports = (bot) => {
    users(bot)
    menu(bot)
    debts(bot)
    exportExcel(bot)
    admin(bot)
}
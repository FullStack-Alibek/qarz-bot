const ExcelJS = require("exceljs")
const debtsRepo = require("./debts.repo")

exports.generateUserExcel = async (telegram_id) => {
    const debts = await debtsRepo.getByTelegram(telegram_id)

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Qarzlar")

    const clean = (str) =>
        String(str).replace(/[<>;$]/g, "").slice(0, 50)

    sheet.columns = [
        { header: "Ism", key: "name", width: 25 },
        { header: "Summa (so'm)", key: "amount", width: 20 },
    ]

    debts.forEach(d => {
        sheet.addRow({
            name: clean(d.client_name),
            amount: d.amount
        })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    return buffer
}

module.exports = exports.generateUserExcel
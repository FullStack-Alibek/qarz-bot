const { Pool } = require("pg")
const { isProd } = require("./env")

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    ssl: isProd ? { rejectUnauthorized: false } : false
})

pool.on("connect", () => console.log("Data bazaga ulandi"))
pool.on("error", (e) => console.error("Data bazada xatolik chiqdi: ", e.message))

module.exports = pool
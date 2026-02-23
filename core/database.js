const { Pool } = require("pg")

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

pool.on("connect", () => console.log("Data bazaga ulandi"))
pool.on("error", (e) => console.error("Data bazada xatolik chiqdi: ", e.message))

module.exports = pool
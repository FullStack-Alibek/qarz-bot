require("dotenv").config()

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    ADMIN_ID: Number(process.env.ADMIN_ID),
    NODE_ENV: process.env.NODE_ENV || "development",
    isProd: process.env.NODE_ENV === "production"
}
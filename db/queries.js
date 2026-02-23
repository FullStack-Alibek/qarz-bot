const pool = require("../core/database")

module.exports = {
    query: (text, params) => pool.query(text, params)
}
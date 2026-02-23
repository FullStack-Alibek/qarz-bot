const { Schema, model } = require("mongoose")

const Featured = new Schema({
    export: true,
    reminders: true,
    ai: false
})

module.exports = Featured
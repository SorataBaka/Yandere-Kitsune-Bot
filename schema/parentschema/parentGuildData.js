const mongoose = require('mongoose')
const staffPing = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    staffPingID : {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})
const warnSystem = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    warnedMember: {
        type: String,
        required: true
    },
    warns: {
        type: [Object],
        required: true
    }
})
const guildData = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    guildInfo: {
        staffPing,
        warnSystem,
    }
})
module.exports = mongoose.model('PerGuildData', guildData)
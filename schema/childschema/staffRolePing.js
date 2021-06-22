const mongoose = require('mongoose')
const staffPing = mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    roleID :{
        type: String,
    },
    boosterRole: {
        type: String,
    }
})

module.exports = mongoose.model('staffPingID', staffPing)
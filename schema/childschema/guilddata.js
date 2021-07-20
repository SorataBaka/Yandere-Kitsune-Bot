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
    },
    roleLimit:{
        type: String
    },
    updatechannel:{
        type: String
    }
})

module.exports = mongoose.model('Guild_data', staffPing)
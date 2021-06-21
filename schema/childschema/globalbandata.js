const mongoose = require('mongoose');
const globalBanSchema = mongoose.Schema({
    guildName:{
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    },
    banReason:{
        type: String,
        required: true
    },
    banDate:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('global-ban-data', globalBanSchema)
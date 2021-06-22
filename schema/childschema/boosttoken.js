const mongoose = require('mongoose');
const guildTokenSchema = mongoose.Schema({
    userID:{
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    token:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Guild-token-schema', guildTokenSchema)
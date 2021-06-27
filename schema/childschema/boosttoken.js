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
    },
},{
    timestamp: true,
})

module.exports = mongoose.model('Tokens', guildTokenSchema)
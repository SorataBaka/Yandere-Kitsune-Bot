const mongoose = require('mongoose')

const claimedSchema = mongoose.Schema({
    roleID: {
        type: String,
        required: true
    },
    roleName: {
        type: String,
        required: true
    },
    cardImageURL: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    userID : {
        type: String,
        required: true
    },
    guildID : {
        type: String,
        required: true
    }
},{
    timestamp: true
})

module.exports = mongoose.model('Card_Database', claimedSchema)
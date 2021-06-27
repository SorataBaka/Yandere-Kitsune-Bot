const mongoose = require('mongoose');

const warns = mongoose.Schema({
    warnReason:{
        type: String,
        required: true
    },
    warnAuthor:{
        type: String,
        required: true
    },
    warnDate:{
        type: String,
        required: true
    },
    warnID : {
        type: String,
        required: true
    }
},{
    _id: false
})
const warnSchema = mongoose.Schema({
    guildID : {
        //guild id
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    },
    warns: [warns]
})

module.exports = mongoose.model('Guild_warns', warnSchema)
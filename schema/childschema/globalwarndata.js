const mongoose = require('mongoose');

const warns = mongoose.Schema({
    warnReason:{
        type: String,
        required: true
    },
    warnDate:{
        type: String,
        required: true
    },
    guildName:{
        type: String,
        required: true
    },
    guildID : {
        //guild id
        type: String,
        required: true
    },
},{
    _id: false
})
const globalWarnSchema = mongoose.Schema({
    userID:{
        type: String,
        required: true
    },
    warns: [warns]
})

module.exports = mongoose.model('Global_warns', globalWarnSchema)
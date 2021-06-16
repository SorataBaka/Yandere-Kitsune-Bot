const mongoose = require('mongoose')
//Server staff ping role ID schema. Stores the staffPingID of the spesific guild
const staffPing = new mongoose.Schema({
    staffPingID : {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})
//Server warning system schema. Warn System defines the base object template that will be present in the guildInfo object. warnSystem will contain an array

//Parent guild data. Contains objects which are guild spesific informations
const memberData = new mongoose.Schema({
    memberID : {
        type: String,
        required: true
    },  
    warns: [Object]
},{
    _id: false
})
const guildData = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    staffPing:{
        type: String,
        required: true
    },
    members : memberData
},{
    _id : false
})
module.exports = mongoose.model('PerGuildData', guildData)  
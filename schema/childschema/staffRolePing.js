const mongoose = require('mongoose')
const staffPing = mongoose.Schema({
    _id: {
        //guild id
        type: String,
        required: true
    },
    roleID :{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('staffPingID', staffPing)
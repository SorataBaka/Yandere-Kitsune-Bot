const mongoose = require('mongoose');
const guildData = new mongoose.Schema({
    guildID: {
        type: String,
        require: true
    },
    staffPingID: String,
    warning: [
        {
            userID: String,
            warns:[
                {
                    warnReason: String,
                    warnAuthor: String,
                    warnDate: Date,
                    warnID: String,
                }
            ]
        }
    ],
    
})

module.exports = mongoose.model('PerGuildData')
const mongoose = require('mongoose')
const tradeRequest = new mongoose.Schema({
  tradeAuthor: { 
    type: String,
    required: true
  },
  tradeRoleOffer: {
    type: String,
    required: true
  },
  tradeRoleRequest:{
    type: String,
    required: true
  },
  guildID : {
    type: String,
    required: true
  },

})

module.exports = mongoose.model('Trade_requests', tradeRequest)
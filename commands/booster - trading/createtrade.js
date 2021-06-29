const commando = require('discord.js-commando')
const tradeRequest = require('../../schema/childschema/traderequestschema.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')


module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'createtrade',
      description: 'Creates a trade request',
      group: 'trading',
      memberName: 'createtrade'
    })
  }
  async run(message){
  }
}
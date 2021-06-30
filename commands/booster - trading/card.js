const commando = require('discord.js-commando')
const Canvas = require('canvas')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageEmbed, MessageAttachment} = require('discord.js')
const { MessageButton } = require('discord-buttons')
module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'mycard',
      description: 'Previews the card of your role',
      group: 'trading',
      memberName: 'mycard'
    })
  }

  async run(message) {
  



  }
}
const mongoose = require('mongoose')
const guildTokenSchema = require('../../schema/childschema/boosttoken.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')


module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client,{
      name: 'createcard',
      description: 'Creates a new Trading card as well as the role with a token',
      group: 'trading',
      memberName: 'createcard',
      argsType: 'multiple',
    })
  }
  async run(message) {
    const {guild, client, author} = message
    const authorid = author.id
    const guildid = guild.id
    const token = args[0]

    


  }
}
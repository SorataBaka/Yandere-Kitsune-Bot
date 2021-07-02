const commando = require('discord.js-commando')
const tradeRequest = require('../../schema/childschema/traderequestschema.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')

module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'trade',
      description: 'Executes a trade with a member',
      group: 'trading',
      memberName: 'trade'
    })
  }

  async run(message) {
    const { client, guild, author } = message
    //authors data
    const authorid = author.id
    const authortag = author.tag
    const authorRoles = message.member.roles.cache
    const authordata = guild.members.cache.get(authorid)

    //mentioned data
    
    const mentionedid = message.mentions.users.first().id
    const mentionedtag = message.mentions.users.first().tag
    const mentionedData = guild.members.cache.get(mentionedid)
    const mentionedRole = mentionedData.roles.cache

    const authorfilter = m => m.author.id === authorid
    const mentionedfilter = m => m.author.id === mentionedid

    
  }
}
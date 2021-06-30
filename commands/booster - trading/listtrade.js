const commando = require('discord.js-commando')
const tradeRequest = require('../../schema/childschema/traderequestschema.js')
const { MessageEmbed } = require('discord.js')

module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client,{
      name: 'listtrades',
      description:  "Lists the available trades",
      group: 'trading',
      memberName: 'listtrades'
    }) 
  }

  async run(message){
    const { author, guild } = message
    const authorid = author.id
    const guildid = guild.id
    const authortag = author.tag
    const query = await tradeRequest.find({tradeRoleTarget: authorid, guildID : guildid})
    if(query.length == 0) return message.reply("You have no active trade requests!")

    const requestEmbed = new MessageEmbed()
      .setTitle(`Active requests for user ${authortag}`)
      .setDescription("Here are your active requests!")
      .setFooter("You can fulfill these trades by doing 'ame trade {trade token}' ")
      .setTimestamp()

    query.forEach(data => {
      const tradeAuthor = data.tradeAuthor
      const offering = data.tradeRoleOffer
      const requesting = data.tradeRoleRequest
      const tradeToken = data.tradeID

      const tradeAuthorName = guild.members.cache.get(tradeAuthor).user.tag
      const offeringRole = guild.roles.cache.get(offering)
      if(!offeringRole) return
      const requestingRole = guild.roles.cache.get(requesting)
      if(!requestingRole) return

      requestEmbed.addField(`By: ${tradeAuthorName}\nToken: ${tradeToken}`, `Offering: ${offeringRole.name}\nRequesting : ${requestingRole.name}`, true)
    })

    message.channel.send(requestEmbed)
  }
}
const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'listmember',
      description: 'Lists the members who owns a role',
      group: 'trading',
      memberName: 'listmember',
    })
  }
  async run(message){
    const { client, guild, author } = message
    const mentionedroleid = message.mentions.roles.first().id
    const mentionedrolename = message.mentions.roles.first().name
    const roledata = guild.roles.cache.get(mentionedroleid).members
    const listEmbed = new MessageEmbed()
      .setTitle(`Members for the role "${mentionedrolename}"`)
      .setColor('#ECFF00')
      .setFooter("The members who owns this role!")
      .setTimestamp()
    await roledata.forEach(function(data, snowflake){
      listEmbed.addField(data.user.tag, "----------------", true)
    })
    await message.channel.send(listEmbed).catch(error =>{
      message.channel.send("I have encountered an error! Please try again later!")
      console.log(error)
    })

  }
}
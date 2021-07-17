const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'listmember',
      description: 'Lists the members who owns a role',
      group: 'trading',
      memberName: 'listmember',
      argsType: "single"
    })
  }
  async run(message, args){
    const { client, guild, author } = message
    var i = {}
    const roleid = args
    if(!args) return message.reply("Please provide a role id! You can do this by right clicking on the role and pressing 'Copy ID' ")
    if(isNaN(args)) return message.reply("Please only provide a role ID!")
    const roledata = guild.roles.cache.get(args)
    if(!roledata) return message.reply("I can't find the role you want! Please make sure the ID you have provided is correct.")
    const rolename = roledata.name
    const owneramount = roledata.members.size

    const embed = new MessageEmbed()
      .setTitle(`These are the members who owns the role "${rolename}!!"`)
      .setFooter(`With a total of ${owneramount} members!!`)
      .setColor("#A3EEFF")
      .setTimestamp()
    roledata.members.forEach((data, i = 1) =>{
      embed.addField(i, data.user.tag, true)
      i++
    })

    message.channel.send(embed)

  }
}
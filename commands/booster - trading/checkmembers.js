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
    const role = args
    if(!args) return message.reply("Please provide a role id or a role name!")
    var sentembed;
    if(isNaN(role)){
      guild.roles.cache.forEach((data, snowflake)=>{
        if(data.name == role){
          const embed = new MessageEmbed()
            .setTitle(`These are the members who owns the role "${data.name}!!"`)
            .setFooter(`With a total of ${data.members.size} members!!`)
            .setColor("#A3EEFF")
            .setTimestamp()
          data.members.forEach(memberdata =>{
            embed.addField(`User ID ${memberdata.id}`, memberdata.user.tag, true)
          })
          message.channel.send(embed).catch()
        }
      })  
      
    }else{
      const roledata = guild.roles.cache.get(args)
      if(!roledata) return message.reply("I can't find the role you want! Please make sure the ID you have provided is correct.")
      const rolename = roledata.name
      const owneramount = roledata.members.size

      const embed = new MessageEmbed()
        .setTitle(`These are the members who owns the role "${rolename}!!"`)
        .setFooter(`With a total of ${owneramount} members!!`)
        .setColor("#A3EEFF")
        .setTimestamp()
      roledata.members.forEach((data) =>{
        embed.addField(`User ID ${data.id}`, data.user.tag, true)
      })

      message.channel.send(embed)

    }

  }
}
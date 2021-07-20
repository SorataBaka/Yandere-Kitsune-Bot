const commando = require('discord.js-commando')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageEmbed } = require('discord.js')
module.exports = class UtilityCommand extends commando.Command {
  constructor(client){
      super(client,{
          name: 'listcustom',
          description: 'Lists every custom role a member has',
          group: 'boosterutilities',
          memberName: 'listcustom',
          guildOnly: true,
      })
  }
  async run(message){
      const { guild, client, author } = message
      const guildcustomlist = await claimedSchema.find({guildID: guild.id})
      if(guildcustomlist.length == 0) return message.reply("Unfortunately this server does not have any custom roles made.")
      const embed = new MessageEmbed()
        .setTitle(`Here are the custom roles that ${author.tag} currently own.`)
        .setTimestamp()
        .setColor("#FF9090")

      var owned = []
      for (let i = 0; i < guildcustomlist.length; i++){
        const roleID = guildcustomlist[i].roleID
        const roleinfo = await guild.members.cache.get(author.id).roles.cache.get(roleID)
        if(roleinfo){
          embed.addField(`Role Name: ${guildcustomlist[i].roleName}`, `Role ID: ${roleID}`)
          owned.push(roleID)
        }
        
      }
      embed.setFooter(`With a total of ${owned.length}`)

      message.channel.send(embed)
  }
}
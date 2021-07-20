const commando = require('discord.js-commando')
const staffPing = require('../../schema/childschema/guilddata.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageEmbed } = require('discord.js')
module.exports = class UtilityCommand extends commando.Command{
  constructor(client){
    super(client,{
      name: 'owner',
      description: 'Checks the custom role owner',
      group: 'boosterutilities',
      memberName: 'owner',
      argsType: 'multiple',
      guildOnly: true
    })
  }
  async run(message, args){
    const { client, guild, author } = message
    const guildid = guild.id
    const authorid = author.id
    if(!args) return message.reply("Please give me a role name or role ID!!")
    const roleinfo = args.join(' ')
    if(isNaN(roleinfo)){
      const query = await claimedSchema.find({guildID: guildid, roleName: roleinfo})
      if(query.length == 0) return message.reply("I can't find this role!")
      const rolename = query[0].roleName
      const roleowner = query[0].userID
      const ownername = guild.members.cache.get(roleowner).user.tag
      const embed = new MessageEmbed()
        .setAuthor(`The owner for role ${rolename} is ${ownername}`)
      message.channel.send(embed)
    }else{
      const query = await claimedSchema.find({guildID: guildid, roleID: roleinfo})
      if(query.length == 0) return message.reply("I can't find this role!")
      const rolename = query[0].roleName
      const roleowner = query[0].userID
      const ownername = guild.members.cache.get(roleowner).user.tag
      const embed = new MessageEmbed()
        .setAuthor(`The owner for role ${rolename} is ${ownername}`)
      message.channel.send(embed)
    }
    
  }
}

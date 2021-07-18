const commando = require('discord.js-commando')
const staffPing = require('../../schema/childschema/guilddata.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageReaction } = require('discord.js')
module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client,{
      name: 'giverole',
      description: 'Gives your custom role a member',
      group: 'trading',
      memberName: 'giverole',
      argsType: 'single',
      guildOnly: true
    })
  }
  async run(message, args){
    const { client, guild, author } = message
    const guildid = guild.id
    const authorid = author.id
    const boostQuery = await staffPing.find({guildID : guildid})
    if(boostQuery.length == 0) return message.reply("I can't find a booster role! Please contact an admin to set it up.")
    const boostid = boostQuery[0].boosterRole
    if(boostid === undefined) return message.reply("I can't find a booster role! Please contact an admin to set it up.")

    //check if author is a booster
    const memberData = guild.members.cache.get(authorid)
    const memberRoleData = memberData.roles.cache.get(boostid)
    if(!memberRoleData) return message.reply("You're not a booster! You can't give roles :(")

    //check if they have a custom role
    const roleQuery = await claimedSchema.find({userID : authorid, guildID : guildid})
    if(roleQuery.length == 0) return message.reply("You don't have a custom role set! Please use your token to make one.")
    const roleId = roleQuery[0].roleID
    const roleData = guild.roles.cache.get(roleId)
    const rolename = roleData.name
    if(roleData.members.size == 11) return message.reply("You have reached the maximum allowed members for a role!")

    //get mentioned member
    const mentionedMemberID = message.mentions.users.first()
    if(!mentionedMemberID) return message.reply("Please mention a member you want to give the role to!")
    const mentionedmemberid = mentionedMemberID.id
    
    guild.members.cache.get(mentionedmemberid).roles.add(roleData).then((data, error)=>{
      if(error) return message.reply("I can't give this member a role!")
      return message.reply(`I have given <@${mentionedmemberid}> the role ${rolename}!!!`)
    })
  }
}

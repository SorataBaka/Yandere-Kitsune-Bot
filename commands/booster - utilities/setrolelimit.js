const commando = require('discord.js-commando')
const staffPing = require("../../schema/childschema/guilddata.js")
module.exports = class UtilityCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: "setrolelimit",
      description: "Sets the role limit for booster custom roles",
      group: 'boosterutilities',
      memberName: "setrolelimit",
      argsType: 'single',
      userPermissions: ['ADMINISTRATOR']
    })
  }
  async run(message, args){
    const { guild, client, author} = message
    const guildid = guild.id
    const limit = args

    if(isNaN(limit)) return message.reply("Please only provide a number!")
    if(limit > 50) return message.reply("Please only provide a number that is less than 50")
    if(limit < 1) return message.reply("Please only provide positive integers!")

    await staffPing.findOneAndUpdate({ 
      guildID: guildid
    },{
      guildID: guildid, 
      $set: {
        roleLimit: limit
      }
    }, {
      upsert: true
    }).then(async(data, error)=>{
      if(error) return message.reply("I have failed to set the role limit. Please try again!")
      return message.reply(`I have set the role limit to ${limit}`)
    })

  }
}
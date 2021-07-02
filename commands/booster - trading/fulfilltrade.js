const commando = require('discord.js-commando')
const tradeRequest = require('../../schema/childschema/traderequestschema.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageEmbed } = require('discord.js')
const { MessageButton } = require('discord-buttons')

module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client,{
      name: 'fulfilltrade',
      description: 'Fulfills a trade request',
      group: 'trading',
      memberName: 'fulfilltrade',
      argsType: 'single'
    })
  }

  async run(message,args){
    const { client, guild, author } = message
    const authorid = author.id
    const guildid = guild.id
    const token = args


    const tradeQuery = await tradeRequest.find({guildID: guildid, tradeID: token, tradeRoleTarget: authorid})
    if(tradeQuery.length == 0) return message.reply("I'm sorry, I can't find any trade requests to you with that token!")
    
    const roleOffered = tradeQuery[0].tradeRoleOffer
    const roleRequested = tradeQuery[0].tradeRoleRequest
    const tradeAuthorID = tradeQuery[0].tradeAuthor

    const offeredData = guild.roles.cache.get(roleOffered)
      if(!offeredData){
        message.reply("The offered role has been deleted from the server. Deleting trade request.")
        return tradeQuery.deleteOne()
      }

      const requestedData = guild.roles.cache.get(roleRequested)
      if(!requestedData){
        message.reply("The requested role has been deleted from the server. Deletin trade request.")
        return tradeQuery.deleteOne()
      }

      const tradeauthor = guild.members.cache.get(tradeAuthorID)
      if(!offererData){
        message.reply("The trade author is not found in the server! Deleting trade request.")
        return tradeQuery.deleteOne()
      }

      const tradetarget = guild.members.cache.get(authorid)
      if(!tradetarget){
        message.reply("The target is not found in the server! Deleting trade request.")
        return tradeQuery.deleteOne()
      }

      tradeauthor.roles.cache.remove(offeredData).then(async(data, error)=>{
        if(error){
          message.reply("There has been some problem trying to fulfill this trade! Please contact an admin.")
          return console.log(error)
        }
      })
    const confirmationQuery = await claimedSchema.find({guildID : guildid, userID: authorid, roleID: roleRequested})
    if(confirmationQuery.length !=0){
      message.reply("You can't trade away your own personal custom role! This request will be cancelled.")
      return tradeQuery.deleteOne()
    }

    const confirmationEmbed = new MessageEmbed()
      .setTitle("Hello~ the following will be the inquiry for your trade")
      .addField("Trade with: ", tradetarget.user.tag)
      .addField(`Receiving:`, offeredData.name)
      .addField(`Giving: `, requestedData.name)
      .setFooter("Press 'Confirm' to finish this trade or 'Cancel' to cancel")
      .setTimestamp()

    const confirmButton = new MessageButton()
      .setLabel("Confirm")
      .setStyle("blurple")
      .setID(message.id+'confirm')
    const cancelButton = new MessageButton()
      .setLabel("Cancel")
      .setStyle("green")
      .setID(message.id+'cancel')
    const filter = button => button.clicker.user.id === authorid
    message.channel.send({
      buttons:[cancelButton, confirmButton],
      embed: confirmationEmbed
    }).then(async newMessage => {
      await newMessage.awaitButtons(filter, {
        max: 1,
        time: 30000
      })
      .then(async buttonData => {
        if(buttonData.first().id === message.id+"confirm"){
          return tradeFunction()
        }else{
          return message.reply("I have cancelled the trade.")
        }
      })
    })

    const tradeFunction = async() => {
      tradeauthor.roles.cache.remove(requestedData).then(async(data, error)=>{
        if(error){
          message.reply("There has been some problem trying to fulfill this trade! Please contact an admin.")
          return console.log(error)
        }
      })

      tradeauthor.roles.cache.add(requestedData).then(async(data, error)=>{
        if(error){
          message.reply("There has been some problem trying to fulfill this trade! Please contact an admin.")
          return console.log(error)
        }
      })

      tradeauthor.roles.cache.add(offeredData).then(async(data, error)=>{
        if(error){
          message.reply("There has been some problem trying to fulfill this trade! Please contact an admin.")
          return console.log(error)
        }
      })
    }
  }
}
const commando = require('discord.js-commando')
const tradeRequest = require('../../schema/childschema/traderequestschema.js')
const { MessageEmbed } = require('discord.js')
const { MessageButton } = require('discord-buttons')

module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'canceltrade',
      description: 'Cancels an ongoing trade',
      group: 'trading',
      memberName: 'canceltrade',
      argsType: 'single'
    })
    }

    async run(message, args){
      const { client, guild, author } = message
      const token = args
      const guildid = guild.id
      const authorid = author.id

      const query = await tradeRequest.find({tradeAuthor: authorid, guildID: guildid, tradeID: token })
      if(query.length == 0) return message.reply("There are no existing trade request by you with this token!")
      const tradeofferid = query[0].tradeRoleOffer
      const traderequestid = query[0].tradeRoleRequest
      const tradetargetid = query[0].tradeRoleTarget
      const tradeoffername = guild.roles.cache.get(tradeofferid).name
      const traderequestname = guild.roles.cache.get(traderequestid).name
      const tradetargetname = guild.members.cache.get(tradetargetid).user.tag

      const cancelEmbed = new MessageEmbed()
        .setTitle(`You are about to cancel the trade request with <@${tradetargetname}>`)
        .setDescription("The following are the information for the trade. Click on confirm to cancel the trade!")
        .addField("Trade Member : ", tradetargetname, true)
        .addField("Offering : ", tradeoffername, true)
        .addField("Receiveing : ", traderequestname, true)
        .setFooter("Click 'cancel' to abort!")
        .setTimestamp()
      const confirmButton = new MessageButton()
        .setLabel("Confirm")
        .setStyle("blurple")
        .setID(message.id+"confirm")

      const cancelButton = new MessageButton()
        .setLabel("Cancel")
        .setStyle("green")
        .setID(message.id+"cancel")
      const filter = button => button.clicker.user.id === authorid
      message.channel.send({
        embed: cancelEmbed,
        buttons: [cancelButton, confirmButton]
      }).then(async newMessage => {
        await newMessage.awaitButtons(filter, {
          max: 1,
          time: 30000
        })
        .then(async buttonData =>{
          console.log(buttonData)
          if(buttonData.first().id == message.id+"confirm"){
            buttonData.defer()
            await tradeRequest.find({tradeAuthor: authorid, guildID: guildid, tradeID: token }).deleteOne().then((data, error) =>{
              if(error) return message.reply("There has been some problem cancelling your request. Please try again!")
              message.reply("I have cancelled your trade request!")
            })

          }else{
            buttonData.defer()
            return message.reply("I have aborted the cancel request!")
          }
        })
      })

      
    
  }
}
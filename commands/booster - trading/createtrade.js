const commando = require('discord.js-commando')
const tradeRequest = require('../../schema/childschema/traderequestschema.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const { MessageButton } = require('discord-buttons')
const shortid = require('shortid')


module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'createtrade',
      description: 'Creates a trade request',
      group: 'trading',
      memberName: 'createtrade',
      argsType: 'single'
    })
  }
  async run(message, args){
    const { client, guild, author } = message
    const authorid = author.id
    const guildid = guild.id


    const filter = m => m.author.id === authorid
    var targetMember = {}
    var roleOffer = {}
    var roleRequest = {}
    var tradetoken = shortid.generate()

    const targetFunction = async() => {
      const targetMemberEmbed = new MessageEmbed()
      .setTitle("Welcome to trade hub!")
      .setDescription("Please mention the user you want to trade with!")
      .setFooter("Type 'Cancel' to cancel the trade request")

      const sent = await message.channel.send(targetMemberEmbed)
      if(!sent) return message.reply("We have encountered an issue! Please try again later.")
      
      message.channel.awaitMessages(filter, {
        max : 1,
        time: 60000
      })
      .then(async targetMessage => {
        if(targetMessage.first().content.toLowerCase() == 'cancel') return message.reply("I have cancelled the trade request")
        if(targetMessage.first().mentions.users.first() === undefined ){
          message.reply("Please mention a member!")
          return targetFunction()
        }else{
          const memberid = targetMessage.first().mentions.users.first().id
          const check = guild.members.cache.get(memberid)
          if(!check){
            message.reply("I can't find this member in this guild! please try again later.")
            return targetFunction()
          }

          const searchQuery = await tradeRequest({guildID : guildid, tradeAuthor: authorid, tradeRoleTarget: memberid})
          if(searchQuery.length == 0) return message.reply("You already have a pending trade with this member! You can only have 1 ongoing at the same time.")
          targetMember = memberid
          return offerFunction()
        }
      })
    }

    const offerFunction = async() =>{
      const offerEmbed = new MessageEmbed()
        .setAuthor("Please specify the role you offer")
        .setDescription("This will be the role that you want to give in the trade")
        .addField("Warning", "This is case sensitive! Make sure you type the role name correctly.")
        .setFooter("Type 'Cancel' to cancel the trade request")
      const sent = await message.channel.send(offerEmbed)
      if(!sent) return message.reply("We have encountered an issue! Please try again later")

      message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      })
      .then(async offerMessage => {
        if(offerMessage.first().content.toLowerCase() == 'cancel') return message.reply("I have cancelled the trade request")
        if(!offerMessage.first().content){
          message.reply("Please give me a role name or a role ID!")
          return offerFunction()
        }else{
          const messageContent = offerMessage.first().content
          if(isNaN(messageContent)){
            const query = await claimedSchema.find({guildID : guildid, roleName: messageContent})
            if(query.length == 0){
              message.reply("This is a non-tradable role! Please choose another one.")
              return offerFunction()
            }else{
              const check = await guild.members.cache.get(targetMember).roles.cache.get(query[0].roleID)
              if(!check){
                message.reply("I can't find this role on you! Please try again")
                return offerFunction()
              }
              roleOffer = query[0].roleID
              return requestFunction()
            }
          }else{
            const query = await claimedSchema.find({guildID: guildid, roleID: messageContent})
            if(query.length == 0){
              message.reply("I can't find the spesified role in the card database! Please try again!")
              return offerFunction()
            }else{
              const check = guild.members.cache.get(targetMember).roles.cache.get(query[0].roleID)
              if(!check){
                message.reply("I can't find this role on you! Please try again")
                return offerFunction()
              }
              roleOffer = query[0].roleID
              return requestFunction()
            }
          }
        }

      })
    }

    const requestFunction = async() => {
      const requestEmbed = new MessageEmbed()
        .setAuthor("Please specify the role you want to request!")
        .setDescription("This will be the role that you want to get in a trade!")
        .addFields("Warning", "This is case sensitive! Make sure you type the role name correctly.")
        .setFooter("Type 'Cancel' to cancel the trade request")
      const sent = await message.channel.send(requestEmbed)
      if(!sent) return message.reply("We have encountered an issue! Please try again later")

      message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      })
      .then(async requestMessage => {
        const requestData = requestMessage.first()
        if(requestData.content.toLowerCase() == 'cancel ') return message.reply("I have cancelled the trade request")
        const messageContent =  requestData.content
        if(!messageContent){
          message.reply("Please specify the role name or the role id that you want to request!")
          return requestFunction()
        }else{
          if(isNaN(messageContent)){
            const query = await claimedSchema.find({guildID : guildid, roleName: messageContent})
            if(query.length == 0){
              message.reply("I can't find this role in the database! Please try again")
              return requestFunction()
            }else{
              const roleid = query[0].roleID
              const check = guild.members.cache.get(targetMember).roles.cache.get(roleid)
              if(!check){
                message.reply("The member doesn't have this role! Please try again.")
              }else{
                roleRequest = roleid
                return confirmationFunction()
              }
            }
          }else{
            const query = await claimedSchema.find({guildID : guildid, roleID: messageContent})
            if(query.length == 0){
              message.reply("I can't find this role in the database! Please try again")
              return requestFunction()
            }else{
              const roleid = query[0].roleID
              const check = guild.members.cache.get(targetMember).roles.cache.get(roleid)
              if(!check){
                message.reply("The member doesn't have this role! Please try again.")
              }else{
                roleRequest = roleid
                return confirmationFunction()
              }
            }
          }
        }
      })
    }

    const confirmationFunction = async() => {
      const targetTag = guild.members.cache.get(targetMember).tag
      const roleOfferName = guild.roles.cache.get(roleOffer).name
      const roleRequestName = guild.roles.cache.get(roleRequest).name

      const confirmationEmbed = new MessageEmbed()
        .setTitle("Please review the following trade request!")
        .addField("You will be trading with : ", targetTag, true)
        .addField("Offering : ", roleOfferName, true)
        .addField("Receiveing : ", roleRequestName, true)
        .addField("Trade token : ", tradetoken, true)
        .setDescription("Once you are sure, click 'Confirm' to send the request. Don't forget to save your token incase you need to cancel later on!")
        .setFooter('Click "Cancel" to cancel the trade request')
        .setTimestamp()

      const confirmButton = new MessageButton()
        .setLabel("Confirm")
        .setStyle("blurple")
        .setID(message.id + "confirm")
      const cancelButton = new MessageButton()
        .setLabel("Cancel")
        .setStyle("green")
        .setID(message.id + "cancel")
      
      await message.channel.send({
        buttons: [cancelButton, confirmButton],
        embed: confirmationEmbed
      }).then(async newMessage => {
        const filter = (button) => button.clicker.user.id === authorid
        await newMessage.awaitButtons(filter, {
          max: 1,
          time: 30000
        })
        .then(async buttonData => {
          if(buttonData.first().id == message.id + 'confirm'){
            buttonData.first().defer()
            return writeFunction()
          }else{
            buttonData.first().defer()
            return message.reply("I have cancelled the trade request!")
          }
        })
      })
    }

    const writeFunction = async() =>{
      const query = await tradeRequest({
        tradeAuthor: authorid,
        guildID : guildid,
        tradeRoleOffer: roleOffer,
        tradeRoleRequest: roleRequest,
        tradeRoleTarget: targetMember,
        tradeID: tradetoken
      })
      query.isNew = true
      query.save().then(async(data, error) =>{
        if(error) return message.reply("There has been an error with processing your request. Please try again later")
        guild.members.cache.get(targetMember).send(`Hi! You have a new trade request available from <@${authorid}>`).catch(error => {
          message.channel.send(`<@${targetMember}! You have a new trade request!`)
        })
        message.channel.send("I have created the trade request for you! You can contact the member for discussion.")
      })
    }

    targetFunction()
    

  }
}
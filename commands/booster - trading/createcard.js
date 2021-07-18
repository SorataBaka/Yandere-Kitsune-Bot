const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const guildTokenSchema = require('../../schema/childschema/boosttoken.js')
const shortid = require('shortid')  
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const staffPing = require('../../schema/childschema/guilddata.js')
const templates = [
  "../../assets/templates/1.png",
  "../../assets/templates/2.png",
  "../../assets/templates/3.png",
  "../../assets/templates/4.png",
  "../../assets/templates/5.png",
  "../../assets/templates/6.png",
]
module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client,{
      name: 'createcard',
      description: 'Creates a new Trading card as well as the role with a token',
      group: 'trading',
      memberName: 'createcard',
      argsType: 'multiple',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 120,
      }
    })
  }
  async run(message, args) {
    const {guild, client, author} = message
    
    const authorid = author.id
    const guildid = guild.id
    const token = args[0]
    var name = {}
    var color = {}
    var image = {}
    var desc = {}
    var id = shortid.generate()
    var cardTemplate = {}
    //check if person already has a card available
    const cardquery = await claimedSchema.find({userID : authorid, guildID : guildid})
    if(cardquery.length != 0) return message.reply("You already have an active trading card! You can't make another one :(")

    //check for available tokens in the database
    const tokenquery = await guildTokenSchema.find({userID : authorid, guildID : guildid})
    if(tokenquery.length == 0) return message.reply("You are not an active booster or your token has been claimed!")
    if(tokenquery[0].token != token) return message.reply("The token is invalid!")

    const boostQuery = await staffPing.find({guildID : guildid})
    if(boostQuery.length == 0) return message.reply("The Booster Role hasn't been set. I can't continue!")
    const boosterID = boostQuery[0].boosterRole
    const rolePosition = guild.roles.cache.get(boosterID).position
    //initiate card creation
    const filter = (newMessage) => newMessage.author.id === authorid
    const nameCreation = async() =>{
      const nameEmbed = new MessageEmbed()
        .setAuthor("Hi! welcome to the card creation system")
        .setTitle("Please give us a title for your role and card!")
        .setDescription("This will be the title thats displayed in your role and card! Choose wisely because you won't be able to change this later~")
        .setFooter("Type 'Cancel' to cancel card and role creation")
      const sent = await message.channel.send(nameEmbed)
      if(!sent) {
        return message.reply("I'm sorry, we've encountered an issue. Please try again later!")
      }
      await message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      })
      .then(async roleMessage =>{
        if(roleMessage.first().content.toLowerCase() == 'cancel') {
          
          return message.reply("I have cancelled the card and role creation!")
        }
        name = roleMessage.first().content
        colorCreation()
      }).catch(timeout => {
        return message.reply("You have ran out of time! Please try again.")})
    }

    const colorCreation = async() =>{
      const colorEmbed = new MessageEmbed()
        .setTitle("Please give us the color for your role and card!")
        .setDescription("This will be the color thats displayed in your role and card! Choose wisely because you won't be able to change this later~")
        .addField("Color reference", "https://htmlcolorcodes.com/")
        .setFooter("Type 'Cancel' to cancel card and role creation")
    const sent = await message.channel.send(colorEmbed)
    if(!sent) {
      return message.reply("I'm sorry, we've encountered an issue. Please try again later!")
    }
    message.channel.awaitMessages(filter, {
      max: 1,
      time: 60000
    })
    .then(async roleMessage =>{
      if(roleMessage.first().content.toLowerCase() == 'cancel') {
        return message.reply("I have cancelled the card and role creation!")
      }
      color = roleMessage.first().content
      imageCreation()
    }).catch(timeout => {
      return message.reply("You have ran out of time! Please try again.")})   
    }
    const imageCreation = async() => {
      const imageEmbed = new MessageEmbed()
        .setTitle("Please give us the image for your role and card!")
        .setDescription("This will be the image thats displayed in your card! Choose wisely because you won't be able to change this later~")
        .addField("WARNING", "Please only use PNG or JPG formatted card. Do not delete your picture after you have sent it as it will cause an error.")
        .setFooter("Type 'Cancel' to cancel card and role creation")
      const sent = await message.channel.send(imageEmbed)
      if(!sent) {
        return message.reply("I'm sorry, we've encountered an issue. Please try again later!")
      }
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      })
      .then(async roleMessage =>{
        if(roleMessage.first().content.toLowerCase() == 'cancel') {
          
          return message.reply("I have cancelled the card and role creation!")
        }
        //format checking
        if(!roleMessage.first().content){
          const mediaurl = roleMessage.first().attachments.first().url
          if(mediaurl.endsWith('.png') ||( mediaurl.endsWith(".jpg") || mediaurl.endsWith(".jpeg"))){
            image = mediaurl
          }else{
            message.reply("Your file is in an invalid format! Please only use PNG or JPG Images. Try again!")
            return imageCreation()
          }
          descCreation()
        }else if(roleMessage.first().content.endsWith('.png') || roleMessage.first().content.endsWith('.jpg')){
          image = roleMessage.first().content
          descCreation()
        }else{
          message.reply("Your image is in an invalid format! Please only use PNG or JPG images. Try again!")
          return imageCreation()
        }
      }).catch(timeout => {
        return message.reply("You have ran out of time! Please try again.")})
    }

    const descCreation = async() =>{
      const descEmbed = new MessageEmbed()
        .setTitle("Please give us the description for your role and card!")
        .setDescription("This will be the description thats displayed on your card! Choose wisely because you won't be able to change this later~")
        .setFooter("Type 'Cancel' to cancel card and role creation")
      const sent = await message.channel.send(descEmbed)
      if(!sent) {
        return message.reply("I'm sorry, we've encountered an issue. Please try again later!")
      }
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      })
      .then(async roleMessage =>{
        if(roleMessage.first().content.toLowerCase() == 'cancel') {
          
          return message.reply("I have cancelled the card and role creation!")
        }
        desc = roleMessage.first().content
        templateCreation()
      }).catch(timeout => {
        
        return message.reply("You have ran out of time! Please try again.")})
    }

    const templateCreation = async() => {
      const templateEmbed = new MessageEmbed()
        .setTitle("Please choose a template for your card!")
        .setDescription("We have an assortment of templates made by Kitsune. Simply type a number corresponding to the template! Beware that this is a one-time thing. You won't be able to change this later")
        .setImage("https://cdn.discordapp.com/attachments/851502836478115852/865665338220871712/brochure.png")
        .setFooter("Type 'Cancel' to cancel card and role creation")
      const sent = await message.channel.send(templateEmbed)
      if(!sent) {
        return message.reply("I'm sorry, we've encountered an issue. Please try again later!")
      }
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000
      })
      .then(async roleMessage =>{
        if(roleMessage.first().content.toLowerCase() == 'cancel') {
          
          return message.reply("I have cancelled the card and role creation!")
        }
        if(isNaN(roleMessage.first().content)) {
          message.reply("Please only provide a number!")
          return templateCreation()
        }
        if(roleMessage.first().content > templates.length - 1) {
          message.reply("The template doesn't exist! Try again.")
          return templateCreation()
        }
        var i = roleMessage.first().content
        cardTemplate = templates[i]
        confirmation()
      }).catch(timeout => {
        console.log(timeout)
        return message.reply("You have ran out of time! Please try again.")})
    }
    const confirmation = async() => {
      const confirmationEmbed = new MessageEmbed()
        .setTitle("Type 'Confirm' to complete the card creation")
      message.channel.send(confirmationEmbed)
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000
      })
      .then(async confirmationMessage => {
        if(confirmationMessage.first().content.toLowerCase() == 'confirm'){
          return createRole()
        }else if(confirmationMessage.first().content.toLowerCase() == 'cancel') {
          return message.reply("I Have cancelled the card creation")
        }else{
          return confirmation()
        }
      })
      .catch(error =>{
        message.reply("You have timed out! Please try again.")
      })
    }

    const createRole = async() =>{
      guild.roles.create({
        data:{
          name: name,
          color: color,
          position: rolePosition + 1
        }
      }).then(async(data, error) => {
        if(error) {
          return message.reply("I have failed to create a role for you! Please try again later!")
        }
        const roleid = data.id
        const rolename = data.name
        const roledata = guild.roles.cache.get(roleid)
        message.member.roles.add(roledata).then(async(data, error) => {
          if(error) return message.reply("I can't give you the role! Please contact an admin and try again.")
          message.reply(`I have created the role <@&${roleid}> and given it to you!!`)
          await writeMongo(roleid, rolename).then(() => deletetoken()).then(a => {
            return
          })
        })
      })
    }

    const writeMongo = async(roleid, rolename) =>{
      await claimedSchema.findOneAndUpdate({
        guildID : guildid,
        userID: authorid,
      },{
        guildID : guildid,
        userID: authorid,
        roleID: roleid,
        roleName: rolename,
        cardImageURL: image,
        description: desc,
        cardID: id,
        template: cardTemplate,
      },{
        upsert: true
      }).then(async(data, error) => {
        if(error) {
          return message.reply("Your role has been created but I can't save your info to the database! Please contact an admin. ")
        }
      })
    }

    const deletetoken = async() =>{
      await guildTokenSchema.find({userID: authorid, guildID: guildid}).deleteOne().catch(err => {
        console.log(err)
      })
    }

    nameCreation()

   }
}

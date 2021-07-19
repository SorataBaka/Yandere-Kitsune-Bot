const commando = require('discord.js-commando')
const { MessageEmbed, MessageAttachment } = require('discord.js')
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

const ImageKit = require("imagekit")
const Canvas = require("canvas")
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
      const sent = await message.reply(nameEmbed)
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
        .setDescription("This will be the color thats displayed in your role and card! Choose wisely because you won't be able to change this later~ Example : #FF9693 ")
        .addField("Color reference", "https://htmlcolorcodes.com/")
        .setFooter("Type 'Cancel' to cancel card and role creation")
    const sent = await message.reply(colorEmbed)
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
      const sent = await message.reply(imageEmbed)
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
            var imageurl = mediaurl
            var imagekit = new ImageKit({
              publicKey : "public_0J3v7HA2CfELfEzLdQOwu7VV4MY=",
              privateKey : "private_3maKoCEAgQw6nt+lC1wz1UxOu9Q=",
              urlEndpoint : "https://ik.imagekit.io/yanderekitsune"
            });
            message.reply("I am uploading your image to our database. Please wait!")
            await imagekit.upload({
              file: imageurl,
              fileName: "default.png"
            }).then((response) =>{
              image = response.url
            }).catch(error =>{
              console.log(error)
              return message.reply("I am having some trouble uploading your image. Please try again later!")
            })
          }else{
            message.reply("Your file is in an invalid format! Please only use PNG or JPG Images. Try again!")
            return imageCreation()
          }
          descCreation()
        }else if(roleMessage.first().content.endsWith('.png') || roleMessage.first().content.endsWith('.jpg')){
          var imageurl = roleMessage.first().content
          var imagekit = new ImageKit({
            publicKey : "public_0J3v7HA2CfELfEzLdQOwu7VV4MY=",
            privateKey : "private_3maKoCEAgQw6nt+lC1wz1UxOu9Q=",
            urlEndpoint : "https://ik.imagekit.io/yanderekitsune"
          });
          message.reply("I am uploading your image to our database. Please wait!")
          await imagekit.upload({
            file: imageurl,
            fileName: "default.png"
          }).then((response) =>{
            image = response.url
          }).catch(error =>{
            console.log(error)
            return message.reply("I am having some trouble uploading your image. Please try again later!")
          })
          descCreation()
        }else{
          message.reply("Your image is in an invalid format! Please only use PNG or JPG images. Try again!")
          return imageCreation()
        }
      }).catch(timeout => {
        console.log(timeout)
        return message.reply("You have ran out of time! Please try again.")})
    }

    const descCreation = async() =>{
      const descEmbed = new MessageEmbed()
        .setTitle("Please give us the description for your role and card!")
        .setDescription("This will be the description thats displayed on your card! Choose wisely because you won't be able to change this later~")
        .setFooter("Type 'Cancel' to cancel card and role creation")
      const sent = await message.reply(descEmbed)
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
      const sent = await message.reply(templateEmbed)
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
      message.reply("Please wait while we prepare for your role.")
      //image generation
      var responseurl = {};
      const canvas = Canvas.createCanvas(1528,2375)
      const ctx = canvas.getContext('2d')
      const loadimage = await Canvas.loadImage(image)
      const newwidth = 1454
      const newheight = (1454/loadimage.width)*loadimage.height
      const background = await Canvas.loadImage(`${__dirname}/${cardTemplate}`)
      await ctx.drawImage(loadimage, 88 , 250 , newwidth , newheight)
      await ctx.drawImage(background, 0 , 0 ,1528, 2375)
      ctx.textAlign = `center`;
      ctx.textBaseline = `top`;
      ctx.font = '90px Noto';
      await ctx.fillText(name, 764, 70 , 1325)
      ctx.font = '70px Noto';
      await ctx.fillText(desc, 791, 1728, 946)
      const buffer = canvas.toBuffer()
      //cdn usage
      // var imagekit = new ImageKit({
      //   publicKey : "public_0J3v7HA2CfELfEzLdQOwu7VV4MY=",
      //   privateKey : "private_3maKoCEAgQw6nt+lC1wz1UxOu9Q=",
      //   urlEndpoint : "https://ik.imagekit.io/yanderekitsune"
      // });
      // await imagekit.upload({
      //   file: buffer,
      //   fileName: "default.png"
      // }).then(async(response) =>{
      //   responseurl = response.url
      //   await responseurl
      // }).catch(error =>{
      //   console.log(error)
      //   return message.reply("I am having some trouble uploading your image. Please try again later!")
      // })
      //send the confirmation embed
      const confirmationEmbed = new MessageEmbed()
        .setTitle("Please check above card.")
        .setDescription("This will be the final card that you receive. Are you sure you want to confirm?")
        .setFooter("Type Confirm to finish or Cancel to abort")
        .setTimestamp()
        .setColor(`#BDB5B5`)
      const preview = new MessageAttachment(buffer, 'image.png')
      message.channel.send(preview).then(()=>{
        message.channel.send(confirmationEmbed)
      })  
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
        console.log(error)
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

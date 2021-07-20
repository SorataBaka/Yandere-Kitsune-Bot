const commando = require('discord.js-commando')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
module.exports = class UtilityCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'mycard',
      description: 'Displays a users custom card',
      group: 'boosterutilities',
      memberName: 'mycard',
      argsType: 'multiple'
    })
  }
  async run(message, args) {
    if(args.length == 0) return message.reply("Please give me a role name or a role id!")
    const roleinfo = args.join(' ')
    const { author, guild, client } = message

    const cardcreation = async(roleID) => {
      const cardquery = await claimedSchema.find({guildID: guild.id, roleID: roleID})
      const imageurl = cardquery[0].cardImageURL
      const rolename = cardquery[0].roleName
      const roleid = cardquery[0].roleID
      const template = cardquery[0].template
      const description = cardquery[0].description
      message.reply("Please wait while I prepare your card!")

      //initiate card generation
      const canvas = Canvas.createCanvas(1528,2375)
      const ctx = canvas.getContext('2d')
      const image = await Canvas.loadImage(imageurl)
      const newwidth = 1454
      const newheight = (1454/image.width)*image.height
      const background = await Canvas.loadImage(`${__dirname}/${template}`)
      await ctx.drawImage(image, 88 , 250 , newwidth , newheight)
      await ctx.drawImage(background, 0 , 0 ,1528, 2375)
      ctx.textAlign = `center`;
      ctx.textBaseline = `top`;
      ctx.font = '90px Noto';
      await ctx.fillText(rolename, 764, 70 , 1325)
      ctx.font = '50px Noto';
      await ctx.fillText(roleid, 420, 1432, 646)
      ctx.font = '70px Noto';
      await ctx.fillText(description, 791, 1728, 946)
      const buffer = canvas.toBuffer();
      const picture = new MessageAttachment(buffer, 'image.png')
      message.channel.send(picture)
    }

    const verification = async(roleID) => {
      const memberrolelist = guild.members.cache.get(author.id).roles
      if(!memberrolelist.cache.get(roleID)) return message.reply("Unfortunately you do not own this role!")
      cardcreation(roleID)
    }

    if(isNaN(roleinfo)){
      const searchquery = await claimedSchema.find({guildID: guild.id, roleName: roleinfo})
      if(searchquery.length == 0) return message.reply("I can't find this custom role in the database! Are you sure that you have typed the name or id correctly?")
      const roleID = searchquery[0].roleID
      verification(roleID)
    }else{
      const searchquery = await claimedSchema.find({guildID: guild.id, roleID: roleinfo})
      if(searchquery.length == 0) return message.reply("I can't find this custom role in the database! Are you sure that you have typed the name or id correctly?")
      const roleID = searchquery[0].roleID
      verification(roleID)
    }

    

   

  }
}
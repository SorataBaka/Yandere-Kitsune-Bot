const commando = require('discord.js-commando')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const Canvas = require('canvas')
const { MessageAttachment } = require('discord.js')
module.exports = class UtilityCommand extends commando.Command{
  constructor(client){
    super(client,{
      name: 'card',
      description:"Displays the role card you own",
      group: "boosterutilities",
      memberName: 'card',
      guildOnly: true,
      argsType: 'multiple'
    })
  }
  async run(message, args){
    const { guild, client, author } = message
    
    const rolequery = await claimedSchema.find({userID: author.id, guildID: guild.id})
    console.log(rolequery)
    if(rolequery.length == 0) return message.reply("I can't find this role!")
    const imageurl = rolequery[0].cardImageURL
    const template = rolequery[0].template

    const canvas = Canvas.createCanvas(1528,2375)
    const ctx = canvas.getContext('2d')
    const image = await Canvas.loadImage(imageurl)
    console.log(image.width)
    console.log(image.height)
    const newwidth = 1454
    const newheight = (1454/image.width)*image.height
    const background = await Canvas.loadImage(`${__dirname}/${template}`)
    await ctx.drawImage(image, 88 , 125 , newwidth , newheight)
    await ctx.drawImage(background, 0 , 0 ,1528, 2375)
    const buffer = canvas.toBuffer();
    const attachment = new MessageAttachment(buffer, 'image.png')
    message.channel.send(attachment)
    
  }
}
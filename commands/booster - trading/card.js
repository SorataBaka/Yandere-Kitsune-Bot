const commando = require('discord.js-commando')
const Canvas = require('canvas')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const { MessageEmbed, MessageAttachment} = require('discord.js')

module.exports = class TradingCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'mycard',
      description: 'Previews the card of your role',
      group: 'trading',
      memberName: 'mycard'
    })
  }

  async run(message) {
    const { author, mentions, client, guild } = message
    const guildid = guild.id
    const authorid = author.id
    const cardQuery = await claimedSchema.find({guildID : guildid, userID : authorid}).catch(error =>{
      console.log(error)
    })  
    if(cardQuery.length == 0) return message.reply("You have no available cards!").catch(error =>{
      console.log(error)
    })
    const imageURL = cardQuery[0].cardImageURL
    



    const canvas = Canvas.createCanvas(463, 652)
    const ctx = canvas.getContext(`2d`)
    const image1 = await Canvas.loadImage(imageURL)
    const background = await Canvas.loadImage(`${__dirname}/../../assets/card.png`)
    //image, sx, sy, swidth, sheight, dx, dy, dwidth, dheight
    ctx.drawImage(image1, 0, 0 , 3650 ,2390 , 52, 110, 365, 239)
    ctx.drawImage(background, 0, 0, 463, 652)
    const buffer =  canvas.toBuffer()
    const attachment = new MessageAttachment(buffer, 'image.png')
    message.channel.send(attachment).catch(error =>{https://cdn.discordapp.com/attachments/851502836478115852/859398118267944960/akame.jpg
      console.log(error)
    })
  }
}
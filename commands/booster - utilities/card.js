const commando = require('discord.js-commando')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const Canvas = require('canvas')
const { MessageAttachment, MessageEmbed } = require('discord.js')
const ImageKit = require('imagekit')
const axios = require('axios')
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
    message.reply("Please wait while we get your card!")
    const { privatekey } = process.env
    const rolequery = await claimedSchema.find({userID: author.id, guildID: guild.id})
    if(rolequery.length == 0) return message.reply("I can't find this role!")
    const imageurl = rolequery[0].cardImageURL
    const template = rolequery[0].template
    const description = rolequery[0].description
    const name = rolequery[0].roleName
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
    await ctx.fillText(name, 764, 90 , 1325)
    const buffer = canvas.toBuffer();
    const picture = new MessageAttachment(buffer, 'image.png')
    // var imagekit = new ImageKit({
    //   publicKey : "public_0J3v7HA2CfELfEzLdQOwu7VV4MY=",
    //   privateKey : "private_3maKoCEAgQw6nt+lC1wz1UxOu9Q=",
    //   urlEndpoint : "https://ik.imagekit.io/yanderekitsune"
    // });
    // await imagekit.upload({
    //   file: buffer,
    //   fileName: "default.png"
    // }).then((response) =>{
    //   const embed = new MessageEmbed()
    //     .setTitle(`${rolequery[0].roleName}`)
    //     .setImage(response.url)
    //     .setFooter("Here is your card!")
    //     .setColor("#FF827F")
    //     .setTimestamp()
    //   message.reply(embed)
    // }).catch(error =>{
    //   console.log(error)
    // })

    message.reply(picture)
    
  }
}
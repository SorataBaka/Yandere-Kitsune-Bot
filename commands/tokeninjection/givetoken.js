const commando = require('discord.js-commando')
const staffPing = require("../../schema/childschema/guilddata.js")
const claimedSchema = require("../../schema/childschema/claimedroleschema.js")
const guildTokenSchema = require("../../schema/childschema/boosttoken.js")
const shortid = require('shortid')
const { MessageEmbed } = require('discord.js')

module.exports = class tokeninjection extends commando.Command{
  constructor(client){
    super(client,{
      name: "givetoken",
      description: "Gives a token to a booster who doesnt have it",
      group: 'trading',
      memberName: "givetoken",
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async run(message){
    const { guild, client, user} = message
    const mentioned = message.mentions.users.first()
    if(!mentioned) return message.reply("Please mention a member you want to give a token to!")
    const mentionedid = mentioned.id
    const guildid = guild.id
    const { prefix } = process.env

    const boosterrolequery = await staffPing.find({guildID: guildid})
    if(boosterrolequery.length == 0) return message.reply("You have not set the booster role for this server! Please do 'dere setboostrole {tag booster role}'")
    const roleID = boosterrolequery[0].boosterRole

    if(!roleID) return message.reply("You have not set the booster role for this server! Please do 'dere setboostrole {tag booster role}'")

    const mentioneddata =  guild.members.cache.get(mentionedid)
    if(!mentioneddata) return message.reply("I can't find the member that you mentioned! Are you sure that the member is still in the server?")
    const mentionedroledata = mentioneddata.roles.cache.get(roleID)

    if(!mentionedroledata) return message.reply("The member you have mentioned is not a booster of the server! You can only give tokens to boosters.")

    const claimedquery = await claimedSchema.find({guildID : guildid, userID : mentionedid})
    if(claimedquery.length != 0) return message.reply("The member you mentioned already has an active role. You can't give them another token.")

    const token = shortid.generate()

    await guildTokenSchema.findOneAndUpdate({
      userID: mentionedid,
      guildID: guildid
    },{
        userID: mentionedid,
        guildID: guildid,
        $set:{
            token: token
        }
    },{
        upsert: true
    }).then((data, error)=>{
        if(error){
            return mentioneddata.send("Hi! this is the automated custom role system. Unfortunately, we are experiencing issues with the system. To claim your free role, please dm one of the staffs to claim it!")
        }else{
            const boostEmbed = new MessageEmbed()
                .setTitle(`Thank you so much for boosting the server ${guild.name}!!!`)
                .setAuthor('You will be eligible to claim a free custom role from your boost!')
                .setDescription(`To claim your free role, please enter the claim role command i have provided in the server you boosted. `)
                .addField("Your token is : ", `*${token}*`)
                .addField("Claim Role Command : ", `${prefix} createcard ${token}`)
            mentioneddata.send(boostEmbed).catch(error =>{
                console.log(error)
                return message.channel.send("Unfortunately, the member you mentioned has turned off their direct messages so i can't send them the token. Please contact the member to claim their token by doing 'dere gettoken' in the server.")
            })
        }
    })









  }
}
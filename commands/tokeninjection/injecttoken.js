const commando = require('discord.js-commando')
const staffPing = require("../../schema/childschema/guilddata.js")
const claimedSchema = require("../../schema/childschema/claimedroleschema.js")
const guildTokenSchema = require("../../schema/childschema/boosttoken.js")
const shortid = require('shortid')
const { MessageEmbed } = require('discord.js')
const util = require('util')
const Promise = require("bluebird")
module.exports = class tokeninjection extends commando.Command{
  constructor(client){
    super(client,{
      name: "injecttoken",
      description: "Gives a token to every booster in the server who doesn't have a custom role.",
      group: 'trading',
      memberName: "injecttoken",
      userPermissions: ['ADMINISTRATOR'],
      ownerOnly:true
    })
  }

  async run(message){
    let successwrite = [];
    let failedwrite = [];
    let failedDM = [];
    const { guild, client, author } = message
    const { prefix } = process.env
    const boosterrolequery = await staffPing.find({guildID: guild.id})
    if(boosterrolequery.length == 0 ) return message.reply("You have not set the booster role for this server! Please do 'dere setboostrole {tag booster role}'")

    const boosterroleid = boosterrolequery[0].boosterRole
    if(!boosterroleid) return message.reply("You have not set the booster role for this server! Please do 'dere setboostrole {tag booster role}'")

    const boostroledata = guild.roles.cache.get(boosterroleid)
    if(!boostroledata) return message.reply("It appears that i can't find the booster role you have previously set in the server. Please try setting it again!")

    const boostrolemembers = boostroledata.members

    const token = shortid.generate()
    
    await boostrolemembers.forEach(async(data, snowflake) => {
      const checkquery = await claimedSchema.find({userID: snowflake, guildID: guild.id})
      if(checkquery.length != 0){
        failedwrite.push(snowflake)
        return message.channel.send(`Member <@${snowflake}> already has an active custom role and would not be given a new token.`)
      }
      const guildMemberData = guild.members.cache.get(snowflake)
      await guildTokenSchema.findOneAndUpdate({
        userID: snowflake,
        guildID: guild.id
      },{
          userID: snowflake,
          guildID: guild.id,
          $set:{
              token: token
          }
      },{
          upsert: true
      }).then((data, error)=>{
          if(error){
              guildMemberData.send("Hi! this is the automated custom role system. Unfortunately, we are experiencing issues with the system. To claim your free role, please dm one of the staffs to claim it!")
              failedwrite.push(snowflake)
          }else{
              successwrite.push(snowflake)
              const boostEmbed = new MessageEmbed()
                  .setTitle(`Thank you so much for boosting the server ${guild.name}!!!`)
                  .setAuthor('You will be eligible to claim a free custom role from your boost!')
                  .setDescription(`To claim your free role, please enter the claim role command i have provided in the server you boosted. `)
                  .addField("Your token is : ", `*${token}*`)
                  .addField("Claim Role Command : ", `${prefix} createcard ${token}`)
              guildMemberData.send(boostEmbed).catch(error =>{
                  console.log(error)
                  failedDM.push(snowflake)
              })
          }
      })
    })
    setTimeout(function(){
      message.channel.send(`Successfully injected ${successwrite.length} tokens to ${boostrolemembers.size} and failed to send ${failedDM.length}`)
    }, 10000)   
  } 
}
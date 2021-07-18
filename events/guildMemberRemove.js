const guildTokenSchema = require('../schema/childschema/boosttoken.js')
const claimedSchema = require("../schema/childschema/claimedroleschema.js")
const { nanoid } = require('nanoid')
const { MessageEmbed } = require('discord.js')
const staffPing = require('../schema/childschema/guilddata.js')
const { prefix } = process.env;
const shortid = require('shortid')
const axios = require('axios')
module.exports = async(client, member)=>{
  const guildid = member.guild.id
  const memberid = member.id

  const { token } = process.env;

  const checkquery = await claimedSchema.find({guildID: guildid, userID:  memberid})
  if(checkquery.length != 0 ){
    const roleid = checkquery[0].roleID
    await axios.request({
      method:"DELETE",
      url:`https://discord.com/api/v8/guilds/${guildid}/roles/${roleid}`,
      headers: {
          "Authorization": `Bot ${token}`
      }
    }).catch()
    await guildTokenSchema.find({userID : memberid, guildID : guildid}).deleteMany().catch()
    await claimedSchema.find({userID : memberid, guildID : guildid}).deleteMany().catch()
  }
}
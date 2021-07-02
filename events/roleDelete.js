const claimedSchema = require('../schema/childschema/claimedroleschema.js')
const tradeRequest = require('../schema/childschema/traderequestschema.js')
module.exports = async(client, role) =>{
  const roleid = role.id
  const offerQuery = await tradeRequest.find({tradeRoleOffer: roleid})
  if(offerQuery.length > 0){
    for(var i = 0; i < offerQuery.length; i++){
      const authordata = offerQuery[i].tradeAuthor
      const guildid = offerQuery[i].guildID
      const tradetoken = offerQuery[i].tradeID
      await client.guild.get(guildid).then(async (data, error) =>{
        if(data){
          guild.members.cache.get(authordata).send("You trade request with the ID : " + tradetoken + " has been cancelled due to the role being deleted").catch()
        }
      })
    }
    offerQuery.deleteMany().catch()
  }
  const requestQuery = await tradeRequest.find({tradeRoleRequest: roleid})
  if(requestQuery.length > 0){
    for(var i = 0; i < requestQuery.length; i++){
      const authordata = offerQuery[i].tradeAuthor
      const guildid = offerQuery[i].guildID
      const tradetoken = offerQuery[i].tradeID
      await client.guild.get(guildid).then(async (data, error) =>{
        if(data){
          guild.members.cache.get(authordata).send("You trade request with the ID : " + tradetoken + " has been cancelled due to the role being deleted").catch()
        }
      })
    }
    requestQuery.deleteMany().catch() 
  }

  const cardQuery = await claimedSchema.find({roleID:role.id})
  if(cardQuery) await claimedSchema.find({roleID:role.id}).deleteOne().catch(error => console.log(error))
}
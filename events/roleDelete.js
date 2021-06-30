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
    await tradeRequest.find({tradeRoleOffer: roleid}).deleteMany().catch()
  }
  const requestQuery = await tradeRequest.find({tradeRoleRequest: roleid})
  if(requestQuery.length > 0){
    if(request.length > 0){
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
      await tradeRequest.find({tradeRoleOffer: roleid}).deleteMany().catch()
  }
}
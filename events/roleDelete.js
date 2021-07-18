const claimedSchema = require('../schema/childschema/claimedroleschema.js')
const tradeRequest = require('../schema/childschema/traderequestschema.js')
module.exports = async(client, role) =>{
  const roleid = role.id

  const cardQuery = await claimedSchema.find({roleID:role.id})
  if(cardQuery) await claimedSchema.find({roleID:role.id}).deleteOne().catch(error => console.log(error))
}
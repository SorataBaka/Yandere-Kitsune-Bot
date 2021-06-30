const tradeRequest = require('../schema/childschema/traderequestschema.js')
module.exports = async(client, role) =>{
  const roleid = role.id
  const offerQuery = await tradeRequest.find({tradeRoleOffer: roleid})
  if(offerQuery.length > 0){
    await tradeRequest.find({tradeRoleOffer: roleid}).deleteMany()
  }
  const requestQuery = await tradeRequest.find({tradeRoleRequest: roleid})
  if(requestQuery.length > 0){
    await tradeRequest.find({tradeRoleRequest: roleid}).deleteMany()
  }
}
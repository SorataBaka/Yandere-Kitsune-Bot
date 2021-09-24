const discord = require("discord.js")
module.exports = async(client, message)=>{
    const channelMap = await client.snipes.get(message.channel.id)
    if(!channelMap){
        client.snipes.set(message.channel.id, [])
    }
    client.snipes.get(message.channel.id).unshift({
        messageid: message.id,
        data: {
            content: message.content,
            author: message.author.tag,
            member: message.member,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null
        }
     })
     console.log(client.snipes.get(message.channel.id))
    
    const deleteCallback = (deletedid) => {
            setTimeout(async function () {
            const deleted = await client.snipes.get(message.channel.id)
            for(var i = 0; i < deleted.length; i++){
                if(deleted[i].messageid == deletedid){
                    deleted.splice(i, 1)
                    console.log(deleted)
                }
            }
        }, 30000)
    }

    deleteCallback(message.id)
}
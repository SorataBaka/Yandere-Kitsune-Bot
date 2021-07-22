const discord = require("discord.js")
module.exports = async(client, message)=>{
    const channelMap = await client.snipes.get(message.channel.id)
    if(!channelMap){
        client.snipes.set(message.channel.id, [])
    }
    client.snipes.get(message.channel.id).push({
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
            // deleted.forEach(data => {
            //     console.log(data)
            //     if(data.messageid == deletedid){
            //         const index = deleted.indexOf({messageid: deletedid})
            //         console.log(index)
            //         deleted.splice(index, 1)
            //     }
            // })
            for(var i = 0; i < deleted.length; i++){
                if(deleted[i].messageid == deletedid){
                    deleted.splice(i, 1)
                    console.log(deleted)
                }
            }
        }, 10000)
    }

    deleteCallback(message.id)
}
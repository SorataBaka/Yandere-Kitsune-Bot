module.exports = async(client, message)=>{
    const key = message.channel.id
    await client.snipes.set(key, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })

    const deleteCallback = async(key) =>{
        setTimeout(async function(){
            const deleted = await client.snipes.delete(key)
            console.log(deleted)
        }, 10000)
    }
    deleteCallback(key)
}
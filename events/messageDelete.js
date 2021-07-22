var counter = 1;
module.exports = async(client, message)=>{
    await client.snipes.set(message.channel.id + counter, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })
    setTimeout(async function (){
        const deleted = await client.snipes.delete(message.channel.id + counter)
        console.log(deleted)
    }, 10000)
    counter = counter + 1
    console.log(client.snipes)
    
}
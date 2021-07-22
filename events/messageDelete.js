var counter = 1;
module.exports = async(client, message)=>{
    await client.snipes.set(message.channel.id + counter, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })

    counter = counter + 1
    console.log(client.snipes)
}
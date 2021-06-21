module.exports = (client, message) =>{
    const beforeMessage = message.content;
    const afterMessage = message.reactions.message.content

    client.editsnipes.set(message.channel.id,{
        author: message.author.tag,
        member: message.member,
        beforeMessage,
        afterMessage,
    })
}
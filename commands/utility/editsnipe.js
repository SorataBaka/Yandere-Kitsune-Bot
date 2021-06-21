const commando = require ('discord.js-commando')
const { MessageEmbed } = require('discord.js')
module.exports = class UtilityCommand extends commando.Command {
    constructor(client){
        super(client,{
            name: 'editsnipe',
            description: 'Sniped an edited message',
            group: 'utility',
            memberName: 'editsnipe',
            aliases: ['edit']
        })
    }

    async run(message){
        const { client } = message
        const editSnipeMessage = client.editsnipes.get(message.channel.id)
        if(editSnipeMessage !== undefined){
            const editSnipeEmbed = new MessageEmbed()
            .setTitle('Snipe!')
            .setAuthor(editSnipeMessage.author, editSnipeMessage.member.user.displayAvatarURL())
            .addField('Before', editSnipeMessage.beforeMessage)
            .addField('After', editSnipeMessage.afterMessage)
            .setFooter('Dor!')
            .setTimestamp()

            message.channel.send(editSnipeEmbed)
        }else{
            message.channel.send('There is nothing to snipe!')
        }
        
    }
}
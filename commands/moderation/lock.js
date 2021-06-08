const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

module.exports = class ModerationCommand extends commando.Command{
    constructor (client){
        super(client, {
            name: 'lock',
            group: 'moderations',
            memberName: 'lock',
            description: 'Lockdown the channel preventing everyone from chatting',
            aliases: ['lck', 'lock'],
            argsType: 'single'
        })
    }
    async run(message){
        const messageChannelID = message.channel.id
        console.log(message.guild.channels.cache.get(messageChannelID))
    }
}
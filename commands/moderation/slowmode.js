const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
module.exports = class ModerationCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: 'slowmode',
            description: 'Sets slowmode for channel',
            group:'moderations',
            memberName: 'slowmode',
            aliases: ['slowmode', 'slow', 'sm', 'slw'],
            userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS', 'ADMINISTRATOR'],
            argsType: 'multiple',
        })
    }
    async run(message, args){
        const channelID = message.channel.id
        if(args.length == 0){
            message.channel.guild.channels.cache.get(channelID).setRateLimitPerUser(0)
        }else if(args[0] == 'none'||args[0] == 'off'){
            message.channel.guild.channels.cache.get(channelID).setRateLimitPerUser(0)
        }else if(isNaN(args[0])) {
            message.reply("Please provide me a number!")
        }else{
            const slowmodeTime = args[0]
            const slowmodeReason = args.slice(1).join(' ')
            message.channel.guild.channels.cache.get(channelID).setRateLimitPerUser(slowmodeTime, slowmodeReason).then(data => {
                if(data) return message.channel.send("I have successfully set the slowmode to " + slowmodeTime + " seconds!")
            })
        }
    }   
}


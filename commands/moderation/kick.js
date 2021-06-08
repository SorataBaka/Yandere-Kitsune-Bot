const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
module.exports = class ModerationCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: 'kick',
            description: 'Kick members',
            group:'moderations',
            memberName: 'kick',
            aliases: ['kick', 'kicks'],
            userPermissions: ['KICK_MEMBERS'],
            argsType: 'multiple'
        })
    }
    async run(message, args){
        if (message.mentions.users.size == 0) return message.reply("There is noone to kick!")
        const mentionedlength = message.mentions.users.size
        const argsLength = args.length
        const cutLength = argsLength - mentionedlength
        const banReason = args.slice(mentionedlength, cutLength+1).join(' ')
        
        const mentionedMembers = message.mentions.users
        mentionedMembers.forEach(function (snowflake){
            const getUserObject = message.guild.members.cache.get(snowflake.id)
            const userName = getUserObject.user.username
            if(message.client.user.id === getUserObject.user.id) return message.reply("I can't kick myself, meanie!!! >:/")
            if(getUserObject == undefined) return message.reply("I can't find this user!!!")
            if(message.guild.members.cache.get(snowflake.id).bannable == false) return message.reply("I can't kick "  + userName + '!!! :c they are my superiors!')
            message.guild.members.cache.get(snowflake.id).kick({reason: banReason + "||Kicked by: " + message.author.username})
            message.channel.send(userName + " has been Kicked for " + banReason + " by " + message.author.username +" See you later~")
        })
    }   
}
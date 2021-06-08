const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
module.exports = class ModerationCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: 'ban',
            description: 'Ban members',
            group:'moderations',
            memberName: 'ban',
            aliases: ['ban', 'bans'],
            userPermissions: ['BAN_MEMBERS'],
            argsType: 'multiple'
        })
    }
    async run(message, args){
        if (message.mentions.users.size == 0) return message.reply("There is noone to ban!")
        const mentionedlength = message.mentions.users.size
        const banReason = args.slice(mentionedlength).join(' ')
        
        const mentionedMembers = message.mentions.users
        mentionedMembers.forEach(function (snowflake){
            const getUserObject = message.guild.members.cache.get(snowflake.id)
            const userName = getUserObject.user.username
            if(message.client.user.id === getUserObject.user.id) return message.reply("I can't ban myself, meanie!!! >:/")
            if(getUserObject == undefined) return message.reply("I can't find this user!!!")
            if(message.guild.members.cache.get(snowflake.id).bannable == false) return message.reply("I can't ban "  + userName + '!!! :c They are my superiors!')
            message.guild.members.cache.get(snowflake.id).ban({days: 0, reason: banReason + "||Banned by: " + message.author.username})
            message.channel.send(userName + " has been Banned for " + banReason + " by " + message.author.username + " Buh-Bye~")
        })
    }   
}
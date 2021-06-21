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
        const { guild, client } = message
        if (message.mentions.users.size == 0) return message.reply("There is noone to kick!")

        const mentionedlength = message.mentions.users.size
        const banReason = args.slice(mentionedlength).join(' ')
        
        const mentionedMembers = message.mentions.users
        mentionedMembers.forEach(function (snowflake){
            const getUserObject = message.guild.members.cache.get(snowflake.id)
            const userName = getUserObject.user.username

            if(message.client.user.id === getUserObject.user.id) return message.reply("I can't kick myself, meanie!!! >:/")
            if(getUserObject == undefined) return message.reply("I can't find this user!!!")
            if(message.guild.members.cache.get(snowflake.id).bannable == false) return message.reply("I can't kick "  + userName + '!!!')
            if(snowflake.id == guild.ownerID) return message.reply("You can't kick the owner dummy!")

            guild.members.cache.get(snowflake.id).send(`You have been kicked by ${message.author.tag} for ${banReason}`).then(()=>{
                message.guild.members.cache.get(snowflake.id).kick({reason: banReason + "||Kicked by: " + message.author.username}).then(async (data, error) =>{
                    if(error){
                        message.channel.send("I can't kick this member!")
                    }else{
                        message.channel.send(userName + " has been Kicked for " + banReason + " by " + message.author.username +" See you later~")
                    }
                })
            })
        })
    }   
}
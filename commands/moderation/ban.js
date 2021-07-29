const commando = require('discord.js-commando')
const {
    MessageEmbed
} = require('discord.js')
const globalBanSchema = require('../../schema/childschema/globalbandata.js')
module.exports = class ModerationCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: 'Ban members',
            group: 'moderations',
            memberName: 'ban',
            aliases: ['ban', 'bans'],
            userPermissions: ['BAN_MEMBERS'],
            argsType: 'multiple'
        })
    }
    async run(message, args) {
        const {
            guild,
            client
        } = message
        if (message.mentions.users.size == 0) return message.reply("There is noone to ban!")
        const mentionedlength = message.mentions.users.size
        const banReason = args.slice(mentionedlength).join(' ')
        const mentionedMembers = message.mentions.users


        mentionedMembers.forEach(function (snowflake) {
            console.log(snowflake.id)
            const getUserObject = message.guild.members.cache.get(snowflake.id)
            const userName = getUserObject.user.username
            if (message.client.user.id === getUserObject.user.id) return message.reply("I can't ban myself, meanie!!! >:/")
            if (snowflake == guild.ownerID) return message.reply("I can't ban the owner!!!")
            if (getUserObject == undefined) return message.reply("I can't find this user!!!")
            if (message.guild.members.cache.get(snowflake.id).bannable == false) return message.reply("I can't ban " + userName)

            //check author and member roles
            const authorRoleID = message.guild.members.cache.get(message.author.id)._roles[0]
            const authorRolePosition = message.guild.roles.cache.get(authorRoleID).position
            const bannedRoleID = message.guild.members.cache.get(snowflake.id)._roles[0]

            if (bannedRoleID !== undefined) {
                const bannedRolePosition = message.guild.roles.cache.get(bannedRoleID).position
                if (authorRolePosition < bannedRolePosition) return message.reply("You can't do that to your superior!")
                guild.members.cache.get(snowflake.id).send(`You have been banned by: ${message.author.username} for ${banReason}`).then(async () => {
                    message.guild.members.cache.get(snowflake.id).ban({
                        days: 0,
                        reason: banReason + "||Banned by: " + message.author.username
                    }).then(async (data, error) => {
                        if (error) {
                            message.channel.send("I can't ban this member!!")
                            console.log(error)
                        } else {
                            message.channel.send(userName + " has been Banned for " + banReason + " by " + message.author.username + " Buh-Bye~")
                            const mongoSave = await globalBanSchema({
                                guildName: message.guild.name,
                                userID: snowflake.id,
                                banReason: banReason,
                                banDate: new Date(),
                            })
                            mongoSave.isNew = true
                            mongoSave.save()

                        }
                    })
                })
            } else {
                guild.members.cache.get(snowflake.id).send(`You have been banned by: ${message.author.username} for ${banReason}`).then(() => {
                    message.guild.members.cache.get(snowflake.id).ban({
                        days: 0,
                        reason: banReason + "||Banned by: " + message.author.username
                    }).then(async (data, error) => {
                        if (error) {
                            message.channel.send("I can't ban this member!!!")
                        } else {
                            message.channel.send(userName + " has been Banned for " + banReason + " by " + message.author.username + " Buh-Bye~")
                            const mongoSave = await globalBanSchema({
                                guildName: message.guild.name,
                                guildID: message.guild.id,
                                userID: snowflake.id,
                                banReason: banReason,
                                banDate: new Date(),
                            })
                            mongoSave.isNew = true
                            mongoSave.save()
                        }
                    })
                })
            }
        })
    }
}
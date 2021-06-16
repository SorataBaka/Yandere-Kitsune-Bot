const commando = require('discord.js-commando')
const warnSchema = require('../../schema/childschema/warnSchema.js')
module.exports = class ModerationCommand extends commando.Command {
    constructor(client) {
        super(client,{
            name: 'removewarn',
            description: 'Removes the warning of a user',
            group: 'moderations',
            memberName: 'removewarn',
            aliases: ['removewrn', 'removewarn', 'remove'],
            argsType: 'multiple',
            userPermissions: ['ADMINISTRATOR', 'BAN_MEMBERS', 'KICK_MEMBERS']
        })
    }
    async run(message, args){
        const { guild, client } = message
        if(message.mentions.users.first() === undefined) return message.reply("Whose warn do you want to remove?")
        if(message.mentions.users.first.id === message.author.id) return message.reply("You can't remove your own warn dummy!!!")
        if(args[1] === undefined) return message.reply("Please provide the warn ID!")

        const userWarned = message.mentions.users.first().id
        const warnID = args[1]

        const authorRole = guild.members.cache.get(message.author.id)._roles[0].id
        const warnedRoleID = guild.members.cache.get(userWarned)._roles[0].id

        if(authorRole < warnedRoleID) return message.reply("You can't remove their warns!")

        if(userWarned === client.user.id) return message.reply("Wh-what?!? I don't have any warns!")

        await warnSchema.findOneAndUpdate({
            guildID : guild.id,
            userID: userWarned
        },{
            $pull: {
                warns: {warnID : warnID}
            }
        }).then(function(data, error){
            if(data){
                console.log(data)
                message.reply("I have successfully removed the warn for " + "<@" + userWarned + '>' + '!!!')
            }else{
                console.log(error)
            }
        })

    }
}
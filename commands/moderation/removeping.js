const commando = require('discord.js-commando')
const staffPing = require('../../schema/childschema/guilddata.js')

module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'removepingrole',
            description: "Removes the staff ping role of the member",
            group: 'moderations',
            memberName: 'removerole',
            aliases:['staffpingremove', 'removestaffping', 'roleremove', 'rolesremove', 'roleremoves'],
            userPermissions: ['BAN_MEMBERS']
        })
    }

    async run(message){
        const { guild, client } = message
        const query = await staffPing.find({guildID : guild.id})
        if(query[0] === undefined) return message.reply("The role has not been set!")

        const pingRoleQuery = query[0].roleID
        const authorID = message.author.id

        const collectionRole = guild.roles.cache.get(pingRoleQuery)
        message.member.roles.remove(collectionRole).then((data, error)=>{
            if(error){
                message.channel.send("You don't have the ping role!")
            }else{
                message.channel.send("I have removed the ping role from you!")
            }
        })
        

    }
}
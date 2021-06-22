const commando = require('discord.js-commando')
const staffPing = require('../../schema/childschema/staffRolePing.js')

module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'getpingrole',
            description: "Adds the staff ping role to the member",
            group: 'moderations',
            memberName: 'getrole',
            aliases:['staffpingget', 'getstaffping', 'roleget', 'rolesget', 'rolegets'],
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
        message.member.roles.add(collectionRole).then((data, error)=>{
            if(error){
                message.channel.send("I can't add the role to you!")
            }else{
                message.channel.send("I have added the ping role to you!")
            }
        })
        

    }
}
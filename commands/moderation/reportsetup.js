const commando = require('discord.js-commando')
const staffPing = require('../../schema/childschema/staffRolePing.js')
module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'reportset',
            description: 'Sets the role to ping',
            group: 'moderations',
            memberName: 'reportset',
            argsType: 'single',
            aliases: ['reportsetup', 'reportsetup'],
            userPermissions: ['ADMINISTRATOR']
        })
    }
    async run(message, args){
        const { member, guild, channel} = message
        //Main function to write to the database
        const writeMongo = async(roleNameContent) => {
            await staffPing.findOneAndUpdate({
                guildID: guild.id
            },{
                guildID: guild.id,
                $set:{
                    roleID: roleNameContent
                }
            },{
                upsert: true
            }).catch(err =>{
                if(err) return message.channel.send("I failed to set up the ping role!")
            })
        }
        if(message.mentions.roles.first() === undefined){
            message.channel.send("Please give the ping role a name :3")
            let messageAuthorFilter = m => m.author.id === message.author.id

            message.channel.awaitMessages(messageAuthorFilter, {
                max: 1,
                time: 60000,
                errors: ['time']
            })
            .then(async( messageSent )=> {
                const roleName = messageSent.first().content
                await guild.roles.create({
                    data: {
                        name : roleName,
                        color: 'RED',
                    }}).then(done =>{
                        const newRoleID = guild.roles.cache.last().id
                        writeMongo(newRoleID)
                        message.channel.send(`I have created the Ping Role!! ʕ￫ᴥ￩ʔ <@&${newRoleID}>`)
                    })

            })
            .catch(collected => {
                message.channel.send('You waited too long to give an answer! ˋ皿ˊ ')
                console.log(collected)
            })

        }else{
            const pingRoleID = message.mentions.roles.first().id
            writeMongo(pingRoleID)
        }
        
    }
}
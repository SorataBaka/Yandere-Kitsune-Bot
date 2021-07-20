const commando = require('discord.js-commando')
const staffPing = require('../../schema/childschema/guilddata.js')

module.exports = class UtilityCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'setupdatechannel',
            description: "sets the bot update channel for the server",
            group: 'moderations',
            memberName: 'setupdatechannel',
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message){
        const { guild, client } = message
        const channelid = message.mentions.channels.first().id

        await staffPing.findOneAndUpdate({
            guildID: guild.id
        },{
            guildID: guild.id,
            $set:{
                updatechannel: channelid
            }
        },{
            upsert: true
        }).then((data, error)=>{
            if(error){
                message.reply("I have failed to set the update channel!")
            }else{
                message.reply(`I have set the updatechannel to <@#${channelid}>`)
            }
        })
    }
}
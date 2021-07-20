const commando = require('discord.js-commando')
const staffPing = require('../../schema/childschema/guilddata.js')

module.exports = class UtilityCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'setboostrole',
            description: "sets the booster role of the server",
            group: 'boosterutilities',
            memberName: 'setboostrole',
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message){
        const { guild, client } = message
        const boostroleid = message.mentions.roles.first().id

        await staffPing.findOneAndUpdate({
            guildID: guild.id
        },{
            guildID: guild.id,
            $set:{
                boosterRole: boostroleid
            }
        },{
            upsert: true
        }).then((data, error)=>{
            if(error){
                message.reply("I have failed to set the boost role!")
            }else{
                message.reply(`I have set the booster role to <@&${boostroleid}>`)
            }
        })
    }
}
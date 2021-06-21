const mongoose = require('mongoose')
const globalWarnSchema = require('../../schema/childschema/globalwarndata.js')
const { MessageEmbed } = require('discord.js')
const commando = require('discord.js-commando')

module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'listglobalwarn',
            description: 'Lists the global warns',
            group: 'moderations',
            memberName: "listglobalwarn",
            aliases:['listglobalwarns'],
            userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS'],
        })
    }
    async run(message){
        if(message.mentions.users.first() == undefined) return message.channel.send("Please mention a user!")
        const warnedUserId = message.mentions.users.first().id
        const query = await globalWarnSchema.find({userID : warnedUserId})

        if(query.length == 0) return message.channel.send('This user has no warnings!')

        const { warns } = query[0]
        const userTag = message.mentions.users.first().tag
        const globalEmbed = new MessageEmbed()
            .setTitle(`Global warnings for user ${userTag}`)
        warns.forEach(data =>{
            globalEmbed.addField(`Warned in ${data.guildName}`, `Warn reason: ${data.warnReason} \n Warn Date: ${data.warnDate} \n Guild ID: ${data.guildID}`)
        })

        message.channel.send(globalEmbed)
        
    }
}
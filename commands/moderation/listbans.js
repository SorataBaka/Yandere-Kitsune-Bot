const mongoose = require('mongoose')
const globalBanSchema = require('../../schema/childschema/globalbandata.js')
const { MessageEmbed } = require('discord.js')
const commando = require('discord.js-commando')

module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'listbans',
            description: 'Lists the global bans',
            group: 'moderations',
            memberName: "listbans",
            aliases: ['listban'],
            userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS'],
        })
    }
    async run(message){
        if(message.mentions.users.size == 0) return message.channel.send("Please mention a user!")
        if(message.mentions.users.first() === undefined) return message.channel.send("This user does not exist!")
        const warnedUserId = message.mentions.users.first().id
        const query = await globalBanSchema.find({userID : warnedUserId})
        
        const globalEmbed = new MessageEmbed()
            .setTitle(`Ban lists for ${message.mentions.users.first().username}`)

        query.forEach(data=>{
            globalEmbed.addField(`Banned in server ${data.guildName}`, `Banned for ${data.banReason} \n Banned date: ${data.banDate}`)
        })

        message.channel.send(globalEmbed)
        
    }
}
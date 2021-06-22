const commando = require('discord.js-commando')
const warnSchema = require('../../schema/childschema/warnSchema')
const { MessageEmbed } = require('discord.js')

module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'listwarn',
            description: 'Lists the warn of a user',
            group: 'moderations',
            memberName: 'listwarns',
            userPermissions:['BAN_MEMBERS', 'KICK_MEMBERS'],
            argsType: 'single',
            aliases:['warnlist', 'list', 'warns', 'listwarns']
        })
    } async run(message, args){
        const{ guild, client } = message
        if(message.mentions.users.first() === undefined ) return message.reply("Please tag the person to list!")
        
        const warnedUser = message.mentions.users.first().id
        const warnedUsername = message.mentions.users.first().username
        const query = await warnSchema.find({guildID : guild.id, userID: warnedUser})
        if (query.length == 0) return message.reply('This user has no active warns! Goodjob'+ "<@" + warnedUser + ">")

        
        const warnsArray = query[0].warns

        console.log(warnsArray)
        
        if(warnsArray.length == 0){
            return message.reply('This user has no active warns! Goodjob'+ "<@" + warnedUser + ">")
        }else{
            const warnListEmbed = new MessageEmbed()
                .setTitle('Warn list for user ' + warnedUsername)

            warnsArray.forEach(warndata =>{
                const {warnReason, warnAuthor, warnDate, warnID } = warndata

                warnListEmbed.addField(`Warn ID: ${warnID}` , `Reason: ${warnReason}\n Warned by: ${warnAuthor} \n Warn Date: ${warnDate}` )
            })

            message.channel.send(warnListEmbed)


        }
        
        
    }
} 
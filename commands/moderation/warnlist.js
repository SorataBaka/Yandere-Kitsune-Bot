const commando = require('discord.js-commando')
const warnSchema = require('../../schema/childschema/warnSchema')
const{ MessageEmbed } = require('discord.js')

module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'listwarn',
            description: 'Lists the warn of a user',
            group: 'moderations',
            memberName: 'listwarns',
            userPermissions:['ADMINISTRATOR', 'BAN_MEMBERS', 'KICK_MEMBERS'],
            argsType: 'single',
            aliases:['warnlist', 'list', 'warns']
        })
    } async run(message, args){
        const{ guild, client } = message
        if(message.mentions.users.first() === undefined ) return message.reply("Please tag the person to list!")
        
        const warnedUser = message.mentions.users.first().id
        const warnedUsername = message.mentions.users.first().username
        const query = await warnSchema.find({guildID : guild.id, userID: warnedUser})
        const warnsArray = query[0].warns

        if(warnsArray.length == 0){
            message.reply('This user has no active warns! Goodjob'+ "<@" + warnedUser + ">")
        }else{
            const warnListEmbed = new MessageEmbed()
                .setTitle('Warn list for user ' + message.mentions.users.first().username)
                
        }
        
        
    }
} 
const commando = require ('discord.js-commando')
const { MessageEmbed } = require('discord.js') 
module.exports = class UtilityCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'snipe',
            description: 'Re-sends deleted messages',
            group: 'utility',
            memberName: 'snipe',
            aliases: ['dor'],
            argsType: 'single',
            throttling:{
                usages: 1,
                duration: 10,
            }
        })
    }
    async run(message, args){
        const { client } = message
        var count;
        if(args.length == 0){
            count = 0
        }else{
            if(isNaN(args[0])) return message.reply("Please only provide a number")
            count = args[0]-1
        }
        let snipeMessage = client.snipes.get(message.channel.id)[count]
        if(snipeMessage){
            snipeMessage = snipeMessage.data
            const snipeEmbed = new MessageEmbed()
                .setTitle('Snipe!')
                .setAuthor(snipeMessage.author, snipeMessage.member.user.displayAvatarURL())
                .setDescription(snipeMessage.content)
                .setImage(snipeMessage.image)
                .setFooter('Dor!')
                .setTimestamp()
            message.channel.send(snipeEmbed)
        }else{
            message.channel.send("There is nothing to snipe!")
        }
    }
}
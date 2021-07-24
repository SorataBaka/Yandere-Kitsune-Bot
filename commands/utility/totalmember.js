const commando = require ('discord.js-commando')
const { MessageEmbed } = require('discord.js') 
module.exports = class UtilityCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'member',
            description: 'Outputs the total of members in the server',
            group: 'utility',
            memberName: 'member',
            throttling:{
                usages: 1,
                duration: 10,
            }
        })
    }
    async run(message, args){
        const { guild } = message
        const memberSize = guild.members.cache.size
        const embed  = new MessageEmbed()
          .setAuthor("The number of members of this server is: ")
          .setTitle(memberSize)
          .setTimestamp()
          .setColor("#FFC2C2")
          .setFooter(`By ${message.author.tag}`)
        message.channel.send(embed)
    }
}
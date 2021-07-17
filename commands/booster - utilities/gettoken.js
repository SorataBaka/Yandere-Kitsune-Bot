const commando = require ('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const guildTokenSchema = require('../../schema/childschema/boosttoken.js')

module.exports = class UtilityCommand extends commando.Command {
    constructor(client){
        super(client,{
            name: 'gettoken',
            description: 'gets the token for the booster',
            group: 'boosterutilities',
            memberName: 'gettoken',
        })
    }
    async run(message){
        const guildID = message.guild.id
        const memberID = message.author.id
        
        const { prefix } = process.env
        const query = await guildTokenSchema.find({guildID : guildID, userID : memberID})
        if(query.length == 0 ) return message.reply("You are not a registered booster or you have claimed your role!")
        
        const token = query[0].token

        const boostEmbed = new MessageEmbed()
            .setTitle(`Thank you so much for boosting the server ${message.author.tag}!!!`)
            .setAuthor('You will be eligible to claim a free custom role from your boost!')
            .setDescription(`To claim your free role, please reference the tutorial below.`)
            .addField("Your token is : ", `*${token}*`)
            .addField("Claim Role Command : ", `${prefix} createcard ${token}`)
        message.reply(boostEmbed)   
    }
}
const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const DIG = require('discord-image-generation')
module.exports = class ImageGeneration extends commando.Command{
    constructor(client){
        super(client, {
            name: 'avatar',
            group: 'utility',
            memberName: 'av',
            description: 'Displays user avatar',
            argsType: 'multiple',
            aliases: ['av']
        })
    }
    async run(message, args){
        const sendEmbed = (avatarURL, avatarUser) => {
            const avatarEmbed = new MessageEmbed()
                .setTitle(avatarUser + "'s Avatar")
                .setImage(avatarURL)
            message.channel.send(avatarEmbed)
        }

        if(args.length !== 0){
            const avatarURL = message.mentions.users.first().displayAvatarURL({dynamic: true, size: 1024})
            const avatarUser = message.mentions.users.first().username
            sendEmbed(avatarURL, avatarUser)
        }else{
            const avatarURL = message.author.displayAvatarURL({dynamic: true, size: 1024})
            const avatarUser = message.author.username
            sendEmbed(avatarURL, avatarUser)
        }
        
    }
}
const commando = require('discord.js-commando')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const DIG = require('discord-image-generation')
module.exports = class ImageGeneration extends commando.Command{
    constructor(client){
        super(client, {
            name: 'bobross',
            group: 'imagegeneration',
            memberName: 'bobross',
            description: 'Happy mistakes',
            argsType: 'multiple',
            aliases: ['ross', 'bob']
        })
    }
    async run(message, args){
        const preset = new DIG.Bobross()
        const mainSendFunction = async(avatarURL, avatarUser) => {
            const DIGImage = await preset.getImage(avatarURL)
            const attachment = new MessageAttachment(DIGImage, 'image.png')
            message.channel.send(avatarUser+ ' is a beautiful mistake', attachment)
        }
        if(args.length !== 0){
            const avatarURL = message.mentions.users.first().displayAvatarURL({dynamic: false, format: 'png'})
            const avatarUser = message.mentions.users.first().username
            mainSendFunction(avatarURL, avatarUser)
        }else{
            const avatarURL = message.author.displayAvatarURL({dynamic: false, format: 'png'})
            const avatarUser = message.author.username
            mainSendFunction(avatarURL, avatarUser)
        }
        
    }
}
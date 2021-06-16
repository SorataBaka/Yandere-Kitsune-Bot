const commando = require('discord.js-commando')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const DIG = require('discord-image-generation')
module.exports = class ImageGeneration extends commando.Command{
    constructor(client){
        super(client, {
            name: 'facepalm',
            group: 'imagegeneration',
            memberName: 'facepalm',
            description: 'When things went wrong',
            argsType: 'multiple',
            aliases: ['facepalm']
        })
    }
    async run(message, args){
        const preset = new DIG.Facepalm()
        const mainSendFunction = async(avatarURL, avatarUser) => {
            const DIGImage = await preset.getImage(avatarURL)
            const attachment = new MessageAttachment(DIGImage, 'image.png')
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
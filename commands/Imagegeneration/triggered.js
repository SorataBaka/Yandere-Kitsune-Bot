const commando = require('discord.js-commando')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const DIG = require('discord-image-generation')
module.exports = class ImageGeneration extends commando.Command{
    constructor(client){
        super(client, {
            name: 'triggered',
            group: 'imagegeneration',
            memberName: 'triggered',
            description: 'Trigger-ify',
            argsType: 'multiple',
            aliases: ['trigger']
        })
    }
    async run(message, args){
        const preset = new DIG.Triggered()
        const mainSendFunction = async(avatarURL, avatarUser) => {
            const DIGImage = await preset.getImage(avatarURL)
            const attachment = new MessageAttachment(DIGImage, 'image.gif')
            message.channel.send(avatarUser+ ' is triggered!', attachment)
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
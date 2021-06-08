const commando = require('discord.js-commando')
const fs = require('fs')
const section = require('./sections.js')
const { MessageEmbed } = require("discord.js")
module.exports = class BoobsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'yuri',
            group: 'nsfw',
            memberName: 'yuri',
            description: 'send a yuri Hentai picture',
            nsfw: true
        })
    }
    async run(message) {
        if(message.author.bot) return
        
        const path = section[2][0]

        //converts text file into array
        const file = fs.readFileSync(path, 'utf8')
        const arrayFile = file.split('\n')


        //creates a random number generator
        const randomNumber = Math.floor(Math.random() * arrayFile.length)

        const randomImage = arrayFile[randomNumber]

        if(randomImage.length !== 0) {
            const imageEmbed = new MessageEmbed()
                .setImage(randomImage)
            message.channel.send(imageEmbed)
        }
        
    }
}   
const commando = require('discord.js-commando')
const fs = require('fs')
const section = require('./sections.js')
const { MessageEmbed } = require("discord.js")
module.exports = class BoobsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'anal',
            group: 'nsfw',
            memberName: 'anal',
            description: 'send an Anal picture',
            nsfw: true
        })
    }
    async run(message) {
        if(message.author.bot) return
        
        const path = section[9][0]

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
const commando = require('discord.js-commando')
const { MessageEmbed } = require("discord.js")
const fs = require('fs')
const activeIntervals = require('./activeintervals.js')

module.exports = class ToggleCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: 'togglelist', 
            group: 'nsfw',
            memberName: 'togglelist',
            description: 'Lists Currently Active Toggles',
            argsType: 'single',
            nsfw: true
        })
    }
        async run(message,args) {
            var listedActiveIntervals = [];
            for(var i = 0; i < activeIntervals.length; i++) {
                listedActiveIntervals.push(activeIntervals[i][0])
            }

            const noActiveEmbed = new MessageEmbed()
                .setDescription("There are no current active categories")
            if(activeIntervals.length == 0) return(message.replyEmbed(noActiveEmbed))
            const text = fs.readFileSync('./Main/artificial-images_hentai/reddit_sub_yuri/urls.txt', 'utf8' )
            const textArray = text.split('\n')

            const randomNumber = Math.floor(Math.random() * textArray.length)
            const thumbnailURI = textArray[randomNumber]

            const listEmbed = new MessageEmbed()
                .setTitle("Currently Active Intervals")
                .setColor("#B53962")
                .setDescription(listedActiveIntervals)
                .setThumbnail(thumbnailURI)
                
            message.replyEmbed(listEmbed)
            
        }

    
}
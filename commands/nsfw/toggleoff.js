const commando = require('discord.js-commando')
const fs = require('fs')
const activeIntervals = require('./activeintervals.js')
const { MessageEmbed } = require("discord.js")

module.exports = class ToggleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'toggleoff',
            group: 'nsfw',
            memberName: 'toggleoff',
            description: 'Toggles off active repeats',
            argsType: 'multiple',
            userPermissions: ['ADMINISTRATOR'],
            nsfw: true

        })
    }
    async run(message,args) {
        const offCategory = args[0]
        if(activeIntervals.length == 0) return message.reply("There are no current active categories")
        if(offCategory.length == 0) return message.reply("Please mention a category")
        
        const offEmbed = new MessageEmbed()
            .setDescription("Successfully stopped " + offCategory + " loop")
        //runs a for loop to brute force search the interval time array
        for(var x = 0; x < activeIntervals.length; x++){
            //for each loop, check if the first object in the loop is equal to the searched data
            if(activeIntervals[x][0] == offCategory) {
                clearInterval(activeIntervals[x][1])
                activeIntervals.splice(x, 1)
                return message.replyEmbed(offEmbed)
            }else {
                if(x == activeIntervals.length -1) return message.reply("Active interval not found")
            }
        }
    }
}
const commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const section = require('./sections.js')
const activeIntervals = require('./activeintervals.js')


module.exports = class ToggleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'toggle', 
            group: 'nsfw',
            memberName: 'toggle',
            description: 'Toggles repeat image sending',
            argsType: 'multiple',
            userPermissions: ['ADMINISTRATOR'],
            usage: "toggle {category name} {Interval in seconds}",
            nsfw: true

        })
    }
    async run(message, args) {
        //default usage embed
        const replyFunction = (string) => {
            const defaultUsage = new MessageEmbed()
                .setTitle(string)
                .setAuthor("Invalid Usage!")
                .setDescription("Correct usage: 'sora toggle {category name} {interval in seconds}'")
                .setColor('#B53962')
            message.replyEmbed(defaultUsage)
        }
        
        //checks if provided category is specified
        if(args.length == 0) return replyFunction('Please mention a category')

        const searchedData = args[0].toLowerCase() //returns searched query
        var intervalTime = args[1] //returns interval time in miliseconds

        //checks if provided intervalTime is a number
        if(args[1] === undefined) return replyFunction("Please Provide an Interval Time")
        if(isNaN(intervalTime)) return replyFunction("Please specify a number")
        if(args[1] < 10) return replyFunction("Time is too fast! The minimum is 10 seconds")

        //checks the activeintervals array if the current category is already online
        for(var y = 0; y < activeIntervals.length; y++){
            if(activeIntervals[y][0] == searchedData) return message.reply("There is already an active category running")
        }

        //initiates main function which takes in URL and the section name
        const mainFunction = (URL, sectionName) => {
            //converts text file of URls into an array
            const text = fs.readFileSync(URL, 'utf8')
            const textByLine = text.split('\n')

            //logs the client channel that the source code has found the variables
            const foundEmbed = new MessageEmbed()
                .setAuthor("Found!")
                .setTitle("Currently playing " + sectionName + " with " + textByLine.length + " Images")
                .setDescription("Sending Images every " + intervalTime + " seconds")
            message.replyEmbed(foundEmbed)
        
            //initiates the main function
            const repeatFunction = () => {
                //initiates the random number generator in relation to how many urls are available
                
                const random = Math.floor(Math.random() * textByLine.length)
                const randomImage = textByLine[random]
                
                //checks if the image url has been provided
                if(randomImage.length !== 0) {
                    message.channel.send(randomImage)
                }else {
                    message.channel.send("Invalid link")
                }
            }
            
            //sets a new interval which repeats repeatFunction with intervalTime received from the args
            var activeIntervalId = setInterval(repeatFunction, intervalTime*1000)
            activeIntervals.push([[searchedData], activeIntervalId])          
        }

        //function to find the searched category from the provided array of included categories   
        for(var i = 0; i < section.length; i++){
            if(section[i][1].toLowerCase() === searchedData){
                return mainFunction(...section[i])
            }else{
                if(i === section.length-1) return replyFunction('not found')
            }
        }

    }
}
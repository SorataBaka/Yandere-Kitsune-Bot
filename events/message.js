const fs = require('fs');
const imageArray = JSON.parse(fs.readFileSync("./assets/messagePics/images.json"))
const messagesArray = JSON.parse(fs.readFileSync("./assets/messagePics/texts.json"))
const { MessageAttachment, MessageEmbed } = require("discord.js")

module.exports = async(client, message)=>{
   const content = message.content
   if(content.toLowerCase() == "kitsu sayang"){
        const imageRandomNumber = Math.floor(Math.random() * imageArray.length)
        const messageRandomNumber = Math.floor(Math.random() * messagesArray.length)
        const embed = new MessageEmbed()
            .setTitle(messagesArray[messageRandomNumber] + " - kitsu")
            .setImage(imageArray[imageRandomNumber])
            .setColor("#FF7A7A")
            .setTimestamp()
        return message.channel.send(embed)
        // message.channel.send(messagesArray[messageRandomNumber])
        // return message.channel.send(imageArray[imageRandomNumber])
    
   } 
}
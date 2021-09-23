const fs = require('fs');
const { MessageAttachment, MessageEmbed } = require("discord.js")
const axios = require('axios')
module.exports = async(client, message)=>{
   const content = message.content
   const messageCall = await axios.get("https://yandere-kitsune-api.herokuapp.com/generatewords")
   if(!messageCall) return
   const newMessage = messageCall.data.Word
   
   const imageCall = await axios.get("https://yandere-kitsune-api.herokuapp.com/image")
   if(!imageCall) return
   const imageArray = imageCall.data.imageList
   const randomPick = Math.floor(Math.random() * imageArray.length)
   const imageName = imageCall.data.imageList[randomPick]

   if(content.toLowerCase() == "kitsu sayang"){
        const embed = new MessageEmbed()
            .setTitle(newMessage + " - kitsu")
            .setImage(`https://yandere-kitsune-api.herokuapp.com/image/${imageName}`)
            .setColor("#FF7A7A")
            .setTimestamp()
        return message.channel.send(embed)
        // message.channel.send(messagesArray[messageRandomNumber])
        // return message.channel.send(imageArray[imageRandomNumber])
    
   } 
}
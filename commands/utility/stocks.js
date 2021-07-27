const commando = require ('discord.js-commando')
const { MessageEmbed } = require('discord.js') 
const axios = require('axios')
module.exports = class UtilityCommand extends commando.Command{
    constructor(client){
        super(client,{
            name: 'stocks',
            description: 'Pulls data from the Indonesian stock exchange market',
            group: 'utility',
            memberName: 'stocks',
            aliases: ['stock'],
            argsType: 'multiple',
            throttling:{
                usages: 1,
                duration: 10,
            }
        })
    }
    async run(message, args){
      const symbol = args[0]
      if(!symbol) return message.reply("Please provide a stock symbol from the Indonesian Stock Exchange market!")
      await axios.request({
        method: 'GET',
        url: `https://compositeapi.harjuno.xyz/api/v1/equity/${symbol}`
      }).then(response => {
        response = response.data
        if(response.status == 404) return message.reply("I can'y find this equity! Please make sure you check your symbol")
        const embed = new MessageEmbed()
          .setAuthor("Latest information from the Indonesian Stock Exchange Market")
          .setTitle(response.symbol)
          .addField("Current Price: ", response.currentPrice, true)
          .addField("Latest Change: ", response.change, true)
          .addField("Percent Change: ", response.changePercentage, true)
          .addField("Bid: ", `Price: ${response.orderBook.bid.price} \n Volume: ${response.orderBook.bid.volume}`, true)
          .addField("Offer: ", `Price: ${response.orderBook.offer.price} \n Volume: ${response.orderBook.offer.volume}`, true)
          .setTimestamp()
          .setFooter("Happy investing!")
          .setColor("#B5EAEA")
        message.channel.send(embed)
      })
    }
}
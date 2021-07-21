const commando = require("discord.js-commando")
const axios = require("axios")
const { MessageEmbed } = require("discord.js")
module.exports = class UtilityCommand extends commando.Command{
  constructor (client){
    super(client,{
      name: "covid",
      description: "Displays the latest covid information for Indonesia. use 'now' for todays data or a province name for a spesific province",
      group: "utility",
      memberName: "covid",
      argsType: "multiple",
      guildOnly: true
    })
  }

  async run(message, args){
    if(args.length == 0){
      await axios.request({
        method: "GET",
        url: "https://apicovid19indonesia-v2.vercel.app/api/indonesia"
      }).then(callback => {
        const nowEmbed = new MessageEmbed()
          .setTitle("Latest Covid-19 update in Indonesia")
          .setDescription("the following is the latest obtainable cummulative information for Covid-19 in Indonesia")
          .addField("Positif: ", callback.data.positif)
          .addField("Dirawat: ", callback.data.dirawat)
          .addField("Sembuh: ", callback.data.sembuh)
          .addField("Meninggal: ", callback.data.meninggal)
          .addField("Last Updated: ", callback.data.lastUpdate)
          .setFooter("Stay safe and stay healthy!")
          .setThumbnail("https://images-ext-2.discordapp.net/external/2_FCdwQ-2ROkGxuLzIfMGrDjrdVrPypK1BiNbvkyvFA/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/831950774849896509/ead9b03d551f98f2e62eacba758f298f.webp?width=671&height=671")
          .setColor("#FF0000")
        return message.channel.send(nowEmbed)
      })
    }else if(args[0].toLowerCase() == 'today'){
      await axios.request({
        method: "GET",
        url: "https://apicovid19indonesia-v2.vercel.app/api/indonesia/harian"
      }).then(callback => {
        const latestdata = callback.data[callback.data.length-1]
        const nowEmbed = new MessageEmbed()
          .setTitle("Latest Covid-19 update in Indonesia")
          .setDescription("the following is the latest obtainable information of daily Covid-19 cases in Indonesia")
          .addField("Positif: ",  latestdata.positif)
          .addField("Dirawat: ", latestdata.dirawat)
          .addField("Sembuh: ", latestdata.sembuh)
          .addField("Meninggal: ", latestdata.meninggal)
          .addField("Total Positif: ", latestdata.positif_kumulatif)
          .addField("Total Dirawat: ", latestdata.dirawat_kumulatif)
          .addField("Total Sembuh: ", latestdata.sembuh_kumulatif)
          .addField("Total Meninggal: ", latestdata.meninggal_kumulatif)
          .addField("Latest Update", new Date(latestdata.lastUpdate * 1000))
          .setFooter("Stay safe and stay healthy!")
          .setThumbnail("https://images-ext-2.discordapp.net/external/2_FCdwQ-2ROkGxuLzIfMGrDjrdVrPypK1BiNbvkyvFA/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/831950774849896509/ead9b03d551f98f2e62eacba758f298f.webp?width=671&height=671")
          .setColor("#FF0000")
        return message.channel.send(nowEmbed)
        })
    }else{
      const province = args.join("_").toLowerCase()
      await axios.request({
       method: "GET",
       url: `https://apicovid19indonesia-v2.vercel.app/api/indonesia/provinsi?name=${province}`
       }).then((callback, error) => {
         const nowEmbed = new MessageEmbed()
          .setTitle("Latest Covid-19 update in Indonesia")
          .setDescription(`the following is the latest obtainable information cumulative Covid-19 cases in ${callback.data[0].provinsi}`)
          .addField("Total Kasus: ", callback.data[0].kasus)
          .addField("Total Dirawat: ", callback.data[0].dirawat)
          .addField("Total Sembuh: ", callback.data[0].sembuh)
          .addField("Total Meninggal: ", callback.data[0].meninggal)
          .setFooter("Stay safe and stay healthy!")
          .setThumbnail("https://images-ext-2.discordapp.net/external/2_FCdwQ-2ROkGxuLzIfMGrDjrdVrPypK1BiNbvkyvFA/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/831950774849896509/ead9b03d551f98f2e62eacba758f298f.webp?width=671&height=671")
          .setColor("#FF0000")
       return message.channel.send(nowEmbed)
       }).catch(err => {
         return message.reply("I can't find this province!")
       })
 
    }
     
  }
}
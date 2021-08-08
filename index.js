const commando = require('discord.js-commando');
const discord  = require('discord.js')
const path = require('path')
const express = require('express')
const server = new express()
const fs = require('fs')
require('dotenv').config();
const mongoose = require('mongoose')
const axios = require('axios')
const staffPing = require("./schema/childschema/guilddata.js")



const token = process.env['token'];
const prefix = process.env['prefix'];
const URI = process.env['URI'];
const { MessageEmbed } = require('discord.js')
const client = new commando.CommandoClient({
    owner: [
        '301322975506857985',
        '402680485731500032'
    ],
    commandPrefix: prefix,
})
client.snipes = new discord.Collection()
client.editsnipes = new discord.Collection()

server.all('/', (req, res) => {
    res.send('Bot is ONLINE')
})
//login to discord client
client.login(token)
client.on('ready', async message => {
    const PORT = process.env.PORT
    server.listen(PORT, async() => {
        client.user.setPresence({activity: {name: "Slashing ようかいs", type: "COMPETING"}, status: 'dnd'})
            .then(console.log)
            .catch(console.error)
        console.log("Server is now up and running")
        mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
        mongoose.set('useFindAndModify', false)
        //notify bot online
        console.log('Bot is now Online')

        //console logging commands
        fs.readdirSync('./commands').forEach(dirs => {
            const commandDirectory = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'))
            for(const commandFile of commandDirectory) {
                console.log('Loading discord.js command : ' + commandFile)
            }
        })
        //set commands to discord.js
        client.registry
            .registerGroups([
                ['moderations', 'Moderation Commands'],
                ['nsfw', 'NSFW Images Commands'],
                ['imagegeneration', "Generates fun images"],
                ['utility', "Server Utilities"],
                ['boosterutilities', "Utilities for Boosters"],
                ['trading', "Role trading system"],
            ])
            .registerCommandsIn(path.join(__dirname, './commands'))
            .registerDefaults()
        })
        client.on('error', (error) =>{
            console.log(error)
        })
        await axios.request({
            method: "GET",
            url: 'https://api.github.com/repos/yandere-kitsune-development/Yandere-Kitsune-Bot/commits'
        }).then(async callback => {
            const commit = callback.data[0].commit
            const commitauthor = commit.author.name
            const commitreason = commit.message
            const commiturl = callback.data[0].html_url
            const commitembed = new MessageEmbed()
                .setTitle(commitreason)
                .setAuthor("The bot has restarted. Here is the latest update on the Yandere Kitsune Repo")
                .setDescription(`Commit by ${commitauthor} on the Yandere Kitsune Bot`)
                .addField(`You can look at the latest commit here: `, commiturl)
                .setThumbnail("https://images-ext-2.discordapp.net/external/2_FCdwQ-2ROkGxuLzIfMGrDjrdVrPypK1BiNbvkyvFA/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/831950774849896509/ead9b03d551f98f2e62eacba758f298f.webp?width=671&height=671")
                .setColor("#FF0000")
            client.guilds.cache.forEach(async (data, snowflake) =>{
                const query = await staffPing.find({guildID: snowflake})
                if(query.length == 0) return
                const channelid = query[0].updatechannel
                if(!channelid) return
                client.guilds.cache.get(snowflake).channels.cache.get(channelid).send(commitembed)
            })
        })




})

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for(const eventFiles of events) {
    console.log(`Loading discord.js event: ${eventFiles}`)
    const eventFileSource = require(`./events/${eventFiles}`)
    client.on(eventFiles.split(".")[0], eventFileSource.bind(null, client))
}


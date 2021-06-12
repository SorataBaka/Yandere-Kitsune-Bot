const commando = require('discord.js-commando');
const path = require('path')
const express = require('express')
const server = new express()
const fs = require('fs')
require('dotenv').config();
const mongoose = require('mongoose')
const guildData = require('./schema/parentschema/parentGuildData')

const { token } = process.env;
const { prefix } = process.env;
const { URI } = process.env;

const client = new commando.CommandoClient({
    owner: [
        '301322975506857985',
        '402680485731500032'
    ],
    commandPrefix: prefix,
})
server.all('/', (req, res) => {
    res.send('Bot is ONLINE')
})
//login to discord client
client.login(token)
client.on('ready', message => {
    server.listen(3000, async() => {
        console.log("Server is now up and running")
        mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
        mongoose.set('useFindAndModify', false)
        client.guilds.cache.forEach(async value => {
            await guildData.findOneAndUpdate({
                _id: value.id
            },{ 
                _id: value.id,
            },{  
                upsert: true
            })
        })
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
                ['utility', "Server Utilities"]
            ])
            .registerCommandsIn(path.join(__dirname, './commands'))
            .registerDefaults()

        })
})
const commando = require('discord.js-commando');
const path = require('path')
const express = require('express')
const server = new express()
const fs = require('fs')
require('dotenv').config();

const { token } = process.env;
const { prefix } = process.env;

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
    server.listen(3000, () => {
        console.log("Server is now up and running")
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
                ['imagegeneration', "Generates fun images"]
            ])
            .registerCommandsIn(path.join(__dirname, './commands'))
            .registerDefaults()
        })
})
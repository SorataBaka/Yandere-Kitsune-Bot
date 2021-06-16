const commando = require('discord.js-commando')

module.exports = class TestCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'test',
            description: 'Executes a spefific test command',
            group: 'utility',
            memberName: 'test',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'single'
        })
    }
    async run(message, args){
        const { client, guild } = message
        const roleID = args
        console.log(guild.roles.cache.get(roleID).position)
    }
}
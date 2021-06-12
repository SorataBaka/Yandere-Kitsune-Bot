const commando = require ('discord.js-commando')
const guildData = require('../../schema/parentschema/parentGuildData')
const { MessageEmbed } = require('discord.js')
var active = []
module.exports = class ModerationCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'report',
            description: 'Sends a DM to every pingable staff',
            group: 'utility',
            memberName: 'report',
            argsType: 'multiple',
        })
    }
    async run(message, args){
        const { guild, client, channel } = message
        const databaseQuery = await guildData.find({_id: guild.id})

        if(databaseQuery[0].guildInfo.staffPing === undefined) return message.reply('You have not set a ping role! Please set it first by doing "reportset {rolename} or reportset"')        
        const pingRole = databaseQuery[0].guildInfo.staffPing.staffPingID


        //converts the list of member with role into an array
        var roleMemberList
        const roleList = message.guild.roles.cache.get(pingRole).members;
        roleMemberList = Array.from(roleList, ([name, value]) => (name))

        const reportContent = args
        if(reportContent.length == 0) return message.reply('Please provide a reason')

        //sets the message link
        const serverID = message.guild.id
        const chatroomID = message.channel.id
        const messageID = message.id
        const messageLink = ('https://www.discord.com/channels/' + serverID + '/' + chatroomID + '/' + messageID)

        const filter = m => m.author.id === message.author.id
        const confirmationMessage = ()=> {
            active.slice(0)
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
            })
            .then(messageNew => {
                if(messageNew.first().content === 'confirm') {
                    const confirmEmbed = new MessageEmbed()
                        .setAuthor("Pinging staff's, please wait.")
                    message.replyEmbed(confirmEmbed)
                    active.splice(0,1)
                    for(var i = 0; i < roleMemberList.length; i++){
                        message.client.users.cache.get(roleMemberList[i]).send(warningEmbed)
                    }
                }else if(messageNew.first().content === 'cancel'){
                    const cancelEmbed = new MessageEmbed()
                        .setAuthor("Terminated : Cancelled")
                    message.replyEmbed(cancelEmbed)
                    active.splice(0,1)
                }else{
                    const invalidEmbed = new MessageEmbed()
                        .setAuthor("Invalid Argument, please type either 'Confirm' or 'Cancel' ")
                    message.replyEmbed(invalidEmbed)
                    confirmationMessage();
                }
            })
            .catch(timeout => message.reply("Terminated: Timed Out"), active.splice(0,1))
        }

        const warningEmbed = new MessageEmbed()
            .setTitle(guild.name + " STAFF WARNING SYSTEM")
            .setAuthor("Alert!")
            .setColor("#FF2D00")
            .addField("Alerts Message", reportContent)
            .addField("Message Shortcut Link", messageLink)

        const confirmationEmbed = new MessageEmbed()
            .setTitle("Please Confirm By Typing 'Confirm' Below")
            .setDescription("You are about to ping the staff with the following message : ")
            .addField("Alerts Message", reportContent)
            .addField("Disclaimer", "Any misuse of this alert system will result in a warn or ban.")
            .setFooter("Type 'cancel' to terminate")
            .setColor("#FF2D00")

        if(active[0] !== 'active'){
            message.replyEmbed(confirmationEmbed).then(confirmationMessage)
            active.push('active')
        }else{
            message.channel.send('Another instance is already running')
        }
    }
}
const { Wanted } = require('discord-image-generation')
const commando = require('discord.js-commando')
const warnSchema = require('../../schema/childschema/warnSchema')
const globalWarnSchema = require('../../schema/childschema/globalwarndata.js')
const globalBanSchema = require('../../schema/childschema/globalbandata')
const { nanoid } = require('nanoid')
module.exports = class ModerationCommand extends commando.Command {
    constructor (client) {
        super(client, {
            name: 'warn',
            description: 'Warns member.',
            group: 'moderations',
            memberName: 'warn',
            argsType: 'multiple',
            userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS']
        })
    }
    async run(message,args){
        const { guild, client } = message
        const messageAuthorID = message.author.id
        const getAuthorRoleID = guild.members.cache.get(messageAuthorID)._roles[0]
        const authorRolePosition = guild.roles.cache.get(getAuthorRoleID).position

        //Defines an array of members to be warned
        const warnedMembers = message.mentions.users
        if(warnedMembers.size == 0) return message.reply("Who do you want to warn? ┐(´д｀)┌")

        //Defines the reason warned by taking in args and joining
        const reasonWarned = args.slice(warnedMembers.size).join(" ")
        if(reasonWarned.length == 0) return message.reply("Please give them a reason for the warn!!!")
        
        const authorWarned = message.author.tag
        const dateWarned = new Date()
        const warnID = nanoid()

        const writeMongo = async(id) =>{
            //if warnable, then execute warn to database
            await warnSchema.findOneAndUpdate({
                guildID : guild.id,
                userID : id
            },{
                guildID : guild.id,
                userID : id,
                $push: {
                    warns: {
                        warnReason: reasonWarned,
                        warnAuthor: authorWarned,
                        warnDate : dateWarned,
                        warnID : warnID
                    }
                }
            },{
                upsert: true
            }).then(async function() {
                await globalWarnSchema.findOneAndUpdate({
                    userID: id,
                },{
                    
                    $push:{
                        warns:{
                            warnReason: reasonWarned,
                            warnDate : dateWarned,
                            guildName: guild.name,
                            guildID: guild.id
                        }
                    }
                },{
                    upsert: true
                })

                message.channel.send("I have successfully warned this member!!! ^_^")

                guild.members.cache.get(id).send(`You have warned by: ${message.author.username} for ${reasonWarned}`)

                const warnLength = await warnSchema.find({guildID: guild.id, userID: id})

                if (warnLength[0].warns.length >= 5) {
                    guild.members.cache.get(id).send(`You have been banned by: ${message.author.username} for going over the warn limit`).then(async()=>{
                        guild.members.cache.get(id).ban({days: 0, reason: "This member is banned for going over the warn limit!!! Goodbye! I hope you learned your lesson"}).then(async (data, error)=>{
                            if(error){
                                message.channel.send("Unfortunately I can't ban this member!")
                            }else{
                                message.channel.send("This member is banned for going over the warn limit!!! Goodbye! I hope you learned your lesson"+ " | Last warned by: " + "<@"+ message.author.id + ">")
                                const mongoSave = await globalBanSchema({
                                    guildName: message.guild.name,
                                    userID: id,
                                    banReason: "This Member is banned for going over the warn limit!!!",
                                    banDate: new Date(),
                                })
                                mongoSave.isNew = true
                                mongoSave.save()
                            }
                        })
                        await warnSchema.find({guildID: guild.id, userID: id}).deleteOne()
                    })
                }
            })
            
        }
        const writeWarn = async(memberWarned) => {
            if(message.author.id == memberWarned) return message.reply("You can't warn yourself ba-baka!! (≖_≖ )")

            if(memberWarned == client.user.id) return message.reply("I can't warn myself meanie!!! ( ˘︹˘ )")

            if(memberWarned == guild.ownerID) return message.reply("You can't warn the owner!")

            //verify if the user can warn said member
            if(guild.members.cache.get(memberWarned)._roles.length == 0){
                writeMongo(memberWarned)
            }else{
                const memberWarnedRole = guild.members.cache.get(memberWarned)._roles[0]
                const memberWarnedPosition = guild.roles.cache.get(memberWarnedRole).position

                if(authorRolePosition < memberWarnedPosition){
                    return message.reply("You can't warn my boss!!")
                }else{
                writeMongo(memberWarned)
                }
            }
        }
        warnedMembers.forEach(function(snowflake, data){
            writeWarn(data)
        })
        
    }
}   
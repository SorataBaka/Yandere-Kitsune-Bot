const guildTokenSchema = require('../schema/childschema/boosttoken.js')
const { nanoid } = require('nanoid')
const { MessageEmbed } = require('discord.js')
const staffPing = require('../schema/childschema/staffRolePing.js')
const { prefix } = process.env;


module.exports = async(client, oldMember, newMember)=>{
    
    const query = await staffPing.find({guildID : newMember.guild.id})
    if(query.length == 0) return 

    const boostroleid = query[0].boosterRole
    if(boostroleid === undefined) return

    const indexOldMember = oldMember._roles.indexOf(boostroleid)
    const indexNewMember = newMember._roles.indexOf(boostroleid)
    if(indexOldMember == -1 && indexNewMember != -1){
        const token = nanoid()
        const { guild } = newMember
        
        const boostMemberId = newMember.user.id
        const guildMemberData = guild.members.cache.get(boostMemberId)
        const boostMemberGuildId = newMember.guild.id
        const boostMemberGuildName = newMember.guild.name


        await guildTokenSchema.findOneAndUpdate({
            userID: boostMemberId,
            guildID: boostMemberGuildId
        },{
            userID: boostMemberId,
            guildID: boostMemberGuildId,
            $set:{
                token: token
            }
        },{
            upsert: true
        }).then((data, error)=>{
            if(error){
                return guildMemberData.send("Hi! this is the automated custom role system. Unfortunately, we are experiencing issues with the system. To claim your free role, please dm one of the staffs to claim it!")
            }else{
                const boostEmbed = new MessageEmbed()
                    .setTitle(`Thank you so much for boosting the server ${boostMemberGuildName}!!!`)
                    .setAuthor('You will be eligible to claim a free custom role from your boost!')
                    .setDescription(`To claim your free role, please reference the tutorial below.`)
                    .addField("Your token is : ", `*${token}*`)
                    .addField("Claim Role Command : ", `${prefix} claimrole ${token}`)
                guildMemberData.send(boostEmbed).catch(error =>{
                    console.log(error)
                })
            }
        })
    }


}
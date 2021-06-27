const guildTokenSchema = require('../../schema/childschema/boosttoken.js')
const staffPing = require('../../schema/childschema/guilddata.js')
const claimedSchema = require('../../schema/childschema/claimedroleschema.js')
const commando = require ('discord.js-commando')
const { MessageEmbed } = require('discord.js')



module.exports = class UtilityCommand extends commando.Command {
    constructor(client){
        super(client,{
            name: 'claimrole',
            description:'Claims the free booster custom role!',
            group: 'utility',
            memberName: 'claimrole',
            argsType: 'single'
        })
    }
    async run(message, args){
        const { guild, client } = message
        const token = args
        const authorID = message.author.id
        const guildID = message.guild.id

        const queryToken = await guildTokenSchema.find({userID : authorID, guildID : guildID})
        if(queryToken.length == 0) return message.reply("You are not a registered booster or you have already claimed your role!")
        const tokendata = queryToken[0]
        console.log(tokendata)

        const boostQuery = await staffPing.find({guildID : guildID})
        if(boostQuery.length == 0) return message.reply("The booster role hasn't been set! Please contact an admin")
        const boostRoleID = boostQuery[0].boosterRole
        console.log(boostRoleID)

        if(boostRoleID === undefined) return message.reply("The boost role hasn't been set!")
        //get boosterroleposition
        const boostroleposition = guild.roles.cache.get(boostRoleID).position


        if(tokendata.token == token && (tokendata.guildID == guild.id && tokendata.userID == message.author.id)){
            //await message and get the role name. then get color. after that make role and give it to the user. set the role position to be on top of the booster role. after all is finish, delete the query from the database
            const roleNameEmbed = new MessageEmbed()
                .setAuthor("Please provide a role name! c:")
                .setDescription("This will be the name of your role so please choose wisely!")
                .setFooter("type 'cancel' to cancel the role creation!")
            message.channel.send(roleNameEmbed)

            const filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
            })
            .then(async rolenameMessage => {
                const roleName = rolenameMessage.first().content
                if(roleName.toLowerCase() == "cancel") return message.reply("I have cancelled the role creation!")
                const roleColorEmbed = new MessageEmbed()
                    .setAuthor("Please provide a role color!")
                    .setDescription("This will be the color of your role. The color will be a hex value! (ex. : #FF2D00) ")
                    .addField("To check the hex value of your color, check the link below : ", "https://htmlcolorcodes.com/")
                    .setFooter("type 'cancel' to cancel the role creation!")
                message.channel.send(roleColorEmbed)

                await message.channel.awaitMessages(filter,{
                    max:1,
                    time: 60000,
                })
                .then(async rolecolorMessage => {
                    const roleColor = rolecolorMessage.first().content
                    if(roleColor.toLowerCase() == 'cancel') return message.reply("I have cancelled the role creation!")
                    guild.roles.create({
                        data: {
                            name: roleName,
                            color: roleColor,
                            position: boostroleposition + 3
                        }
                    }).then(async (data, error)=>{
                        if(error)message.reply("i have failed to create the role!")
                        const newRoleID = data.id
                        const newRoleData = guild.roles.cache.get(newRoleID)
                        const saveClaimed = await claimedSchema({
                            roleID: data.id,
                            roleName: data.name,
                            userID: message.author.id,
                            guildID: guild.id
                        })
                        saveClaimed.isNew = true
                        saveClaimed.save()

                        message.member.roles.add(newRoleData).then(async(data, error)=>{
                            if(error) return message.channel.send("I can't give you the role! Please contact an admin and try again")
                            message.channel.send(" I have created the role for you!")
                            await guildTokenSchema.find({guildID : guild.id, userID : message.author.id}).deleteOne()
                        })
                    }).catch(timeout =>{
                        return message.reply("You have timed out! Please try again")
                    })
                })
            }).catch(timeout =>{
                return message.reply("You have timed out! please try again")
            })
        }else{
            message.reply("Either your token is invalid, you are in the wrong server, or you are not a registered booster!")
        }

    }
}
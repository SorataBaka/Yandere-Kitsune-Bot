const { ShardingManager } = require('discord.js')
require('dotenv').config()
const token = process.env['token']
const manager = new ShardingManager("./index.js", {
  totalShards: 'auto',
  token: token,
})

manager.on("shardCreate", (shard) => console.log(`Shard ${shard.id} launched`))
manager.spawn()
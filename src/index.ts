require('dotenv').config()
import { Intents, Client } from 'discord.js'
import { handleCommand, registerCommands } from './services/command.service'
import mongoose from 'mongoose'
import { registerIntervalFunctions } from './services/interval.service'

/** MONGODB */

const dbURI = process.env.MONGODB_URI ?? ''

mongoose.connect(dbURI)
    .then(() => {
    console.log('Connected to database.')
    
    registerIntervalFunctions(client);
    console.log('Initiated interval functions.')
    }).catch(err => console.error(err))
const options = {
    intents: [
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
}
const client = new Client(options)

client.once('ready', () => { 
    registerIntervalFunctions(client)
    registerCommands(client)
    console.log('Bot ready!')
})

client.on('interactionCreate', async (interaction) => {    
    if(!interaction.isCommand()) return
     
    handleCommand(interaction)
})

client.login(process.env.DISCORD_BOT_SECRET)

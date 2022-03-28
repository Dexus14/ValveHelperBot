require('dotenv').config()
import { Intents, Client } from 'discord.js'
import { handleCommand, registerCommands } from './services/command.service'
import mongoose from 'mongoose'
import { registerIntervalFunctions } from './services/interval.service'
import { createServer } from 'http'

// Simple GET request for Heroku
const app = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('I\'m alive!')
})

app.listen(process.env.PORT ?? 3001)

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

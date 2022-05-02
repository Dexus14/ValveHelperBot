import { ApplicationCommandData, Client, CommandInteraction } from "discord.js";
import { readdirSync } from "fs";
import { join } from 'path'
import Command from "../interfaces/command.interface";
import IntervalNotificationSubscriber from "../models/IntervalNotificationSubscriber";
import { handleError } from "./error.service";

const commands = loadCommands()

export async function registerCommands(client: Client) {
    const commandsToSet = getCommandsToRegister()    

    const testGuildId = process.env.TEST_GUILD_ID
    if(testGuildId) {
        const guild = await client.guilds.fetch(testGuildId)
        guild.commands.set(commandsToSet)
    } else {
        const botCommands = client.application?.commands

        if (!botCommands) return handleError('No bot commands.')
    
        botCommands.set(commandsToSet)
            .then(res => console.log(res)
            )
            .catch(err => console.error(err))
    }
}

export async function handleCommand(interaction: CommandInteraction) {
    if(!interaction) return handleError('No interaction.')
    
    const { commandName } = interaction
    const command = commands.filter(command => command.name === commandName)[0]

    interaction.reply({ content: 'Waiting...' })
        .then(() => command.run(interaction))
}

export async function subscriberExists(type: string, channelId: string, info: string) {
    return await IntervalNotificationSubscriber.exists({ type, channelId, info })
}

export async function addNotificationSubscriber(interaction: CommandInteraction, info: any, type: string) {
    const channelId = interaction.channel?.id
    if(!channelId) return handleError('Unknown error.', interaction)

    const userId = interaction.user.id
    if(!userId) return handleError('Unknown error.', interaction)
    
    const test = await subscriberExists(type, channelId, info)

    if(test) {
        handleError('Already subscribed.', interaction)
        throw new Error('Error: subscriber exists!')
    }

    return new IntervalNotificationSubscriber({
        type,
        channelId,
        userId,
        info
    }).save()
}

function getCommandsToRegister() {
    return commands.map(command => {
        const { name, description, options } = command
        const commandData: ApplicationCommandData = {
            name,
            description,
            options,
            defaultPermission: true
        }
        
        return commandData
    })
}

function loadCommands(): Command[] {
    const commandPath = join(__dirname, '../commands')
    const files = readdirSync(commandPath)
    const commands = []

    for(const file of files) {
        const fileDirectory = join(commandPath, file)
        try {
            commands.push(require(fileDirectory).default)
        } catch(err) {
            console.error('Error while loading file: ' + fileDirectory);
        }
    }
    
    return commands
}



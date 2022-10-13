import { ApplicationCommandData, Client, CommandInteraction } from "discord.js";
import { readdirSync } from "fs";
import { join } from 'path'
import Command from "../interfaces/command.interface";
import IntervalNotificationSubscriber from "../models/IntervalNotificationSubscriber";
import { handleError } from "./error.service";

const commands = loadCommands()

export async function registerCommands(client: Client) {

    const testGuildId = process.env.TEST_GUILD_ID
    if(testGuildId) {
        const commandsToSet = getCommandsToRegister()

        const guild = await client.guilds.fetch(testGuildId)
        await guild.commands.set(commandsToSet)
    } else {
        const commandsToSet = getCommandsToRegister(true)

        const botCommands = client.application?.commands

        if (!botCommands)
            return handleError('No bot commands.')
    
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
        .then(() => {
            try {
                command.run(interaction)
            } catch(err) {
                handleError('Some error has occured!', interaction)
            }
        })
}

function getCommandsToRegister(ignoreTest = false) {
    return commands.map(command => {
        const { name, description, options } = command
        const commandData: ApplicationCommandData = {
            name,
            description,
            options,
            defaultPermission: true
        }
        
        return commandData
    }).filter(cmd => cmd.name !== 'test')
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



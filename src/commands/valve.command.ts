import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import Command from "../interfaces/command.interface";
import { handleError } from "../services/error.service";
import news from '../services/subcommands/valve/news.subcommand'
import profile from '../services/subcommands/valve/profile.subcommand'
import csgoStatus from '../services/subcommands/valve/csgoStatus.subcommand'

const COMMAND_NAME = 'valve'
const COMMAND_DESCRIPTION = 'A command that displays valve stuff.'
const COMMAND_OPTIONS: ApplicationCommandOptionData[] = [
    {
        type: 'SUB_COMMAND',
        name: 'news',
        description: 'Displays app news.',
        options: [
            {
                type: 'STRING',
                name: 'appid',
                description: 'The id of app that you want to check.',
                required: true
            }
        ]
    },
    {
        type: 'SUB_COMMAND',
        name: 'profile',
        description: 'Displays player\'s profile.',
        options: [
            {
                type: 'STRING',
                name: 'userid',
                description: 'The id of user that you want to check.',
                required: true
            }
        ]
    },
    {
        type: 'SUB_COMMAND',
        name: 'status',
        description: 'Displays steam server status.',
        options: []
    }
]

async function run(interaction: CommandInteraction) {
    const { options } = interaction
    const subcommand = options.getSubcommand(true)    

    switch(subcommand) {
        case 'news':
            news(interaction)
            break
        case 'profile':
            profile(interaction)
            break
        case 'status':
            csgoStatus(interaction)
            break
        default:
            handleError('Invalid subcommand.', interaction)
    }
}

const command: Command = {
    name: COMMAND_NAME,
    description: COMMAND_DESCRIPTION,
    options: COMMAND_OPTIONS,
    run: run
}

export default command

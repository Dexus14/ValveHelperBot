import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import Command from "../interfaces/command.interface";
import { handleError } from "../services/error.service";
import bans from "../services/subcommands/watch/bans.subcommand";
import list from "../services/subcommands/watch/list.subcommand";
import news from '../services/subcommands/watch/news.subcommand'
import stopWatch from "../services/subcommands/watch/stop.subcommand";

const COMMAND_NAME = 'watch'
const COMMAND_DESCRIPTION = 'A command that allows you to watch for updates on topics.'
const COMMAND_OPTIONS: ApplicationCommandOptionData[] = [
    {
        type: 'SUB_COMMAND',
        name: 'list',
        description: 'List all watched things.',
        options: []
    },
    {
        type: 'SUB_COMMAND',
        name: 'bans',
        description: 'Watch for when a user gets banned.',
        options: [
            {
                type: 'STRING',
                name: 'userid',
                description: 'The id of user that you want to watch.',
                required: true
            }
        ]
    },
    {
        type: 'SUB_COMMAND',
        name: 'news',
        description: 'Watch for new news articles.',
        options: [
            {
                type: 'STRING',
                name: 'appid',
                description: 'The id of app that you want to watch.',
                required: true
            }
        ]
    },
    { // TODO: Make a better way to handle stop command.
        type: 'SUB_COMMAND',
        name: 'stop',
        description: 'Remove watch subscription.',
        options: [
            {
                type: 'STRING',
                name: 'id',
                description: 'Id of a subscription. For the index please refer to the "/watch list".',
                required: true
            }
        ]
    }
]

async function run(interaction: CommandInteraction) {
    const { options } = interaction
    const subcommand = options.getSubcommand(true)    

    switch(subcommand) {
        case 'news':
            news(interaction)
            break
        case 'list':
            list(interaction)
            break
        case 'stop':
            stopWatch(interaction)
            break
        case 'bans':
            bans(interaction)
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

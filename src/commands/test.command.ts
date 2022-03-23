import { ApplicationCommandOptionData, CommandInteraction } from "discord.js"
import Command from "../interfaces/command.interface"
import { handleError } from "../services/error.service"
import { getFriendList, getPlayerBans, getUserStatsForGame, resolveVanityUrl } from "../services/valve.service"
// import { handleNewsInterval } from "../services/interval.service"


const COMMAND_NAME = 'test'
const COMMAND_DESCRIPTION = 'A command made for testing/'
const COMMAND_OPTIONS: ApplicationCommandOptionData[] = []

async function run(interaction: CommandInteraction) {
    try {
        const id = await resolveVanityUrl('dexu12e@$%@#%4sss/dsddfs')
        console.log(id)        
    } catch(err) {
        handleError('Couldnt resolve vanity url.', interaction)
    }
    

    interaction.editReply('done!')
}

const command: Command = {
    name: COMMAND_NAME,
    description: COMMAND_DESCRIPTION,
    options: COMMAND_OPTIONS,
    run: run
}

export default command

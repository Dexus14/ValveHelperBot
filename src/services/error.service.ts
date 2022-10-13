import { CommandInteraction } from "discord.js";

const ERROR_VERBOSITY = parseInt(process.env.ERROR_VERBOSITY ?? '0')

export function handleError(message: string, interaction?: CommandInteraction) {
    if(interaction) 
        interaction.editReply('Error while executing command: ' + message) // TODO: Make this into a pretty embed.

    if(ERROR_VERBOSITY > 0) 
        console.log('Error: ' + message)
        

    if(ERROR_VERBOSITY > 1)
        console.trace()
}

import { CommandInteraction } from "discord.js"
import { addNotificationSubscriber } from "../../command.service"
import { handleError } from "../../error.service"
import { getPlayerBans, resolveVanityUrl } from "../../valve.service"

export default async function bans(interaction: CommandInteraction) {
    const userId = interaction.options.getString('userid')
    if(!userId) return handleError('Invalid parameter.', interaction)
     
    const info = await resolveVanityUrl(userId)

    addNotificationSubscriber(interaction, info, 'bans')
        .then(() => interaction.editReply('SUCCESS'))
        .catch(err => {
            handleError('Database error.', interaction)          
            console.error(err)
        })
}

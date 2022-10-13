import { CommandInteraction } from "discord.js"
import { addNotificationSubscriber, userCanWatch } from "../../watch.service"
import { handleError } from "../../error.service"
import { resolveVanityUrl } from "../../valve.service"

export default async function bans(interaction: CommandInteraction) {
    const canWatch = await userCanWatch(interaction.user.id)
    if(!canWatch)
        return handleError(`You cannot watch. Please make sure your limit of ${process.env.MAX_WATCHES} is not exceeded.`, interaction)
    
    const userId = interaction.options.getString('userid')
    if(!userId)
        return handleError('Invalid parameter.', interaction)
     
    const info = await resolveVanityUrl(userId)

    addNotificationSubscriber(interaction, info, 'bans')
        .then(() => interaction.editReply('SUCCESS'))
        .catch(err => handleError(err, interaction))
}

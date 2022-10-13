import { CommandInteraction } from "discord.js";
import { addNotificationSubscriber, userCanWatch } from "../../watch.service";
import { handleError } from "../../error.service";
import { STEAM_APP_ID_REGEX } from "../../valve.service";

export default async function list(interaction: CommandInteraction) {
    const canWatch = await userCanWatch(interaction.user.id)
    if(!canWatch) return handleError('You cannot watch.', interaction) // TODO: Make better error msg
    // TODO: Check if app exists
    const appId = interaction.options.getString('appid')
    if(!appId) return handleError('Invalid parameter.', interaction)
     
    const regex = new RegExp(STEAM_APP_ID_REGEX)
    
    if(!regex.test(appId)) return handleError('Invalid parameter.', interaction)

    addNotificationSubscriber(interaction, appId, 'news')
        .then(() => interaction.editReply('SUCCESS'))
        .catch(err => {
            handleError('Database error.', interaction)
            console.error(err)            
        }) 
}

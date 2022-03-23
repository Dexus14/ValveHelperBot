import { CommandInteraction } from "discord.js";
import { addNotificationSubscriber } from "../../command.service";
import { handleError } from "../../error.service";
import { STEAM_APP_ID_REGEX } from "../../valve.service";

export default async function list(interaction: CommandInteraction) {
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

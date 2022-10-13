import { CommandInteraction } from "discord.js";
import { addNotificationSubscriber, userCanWatch } from "../../watch.service";
import { handleError } from "../../error.service";
import {getNewsForApp, STEAM_APP_ID_REGEX} from "../../valve.service";

export default async function news(interaction: CommandInteraction) {
    const canWatch = await userCanWatch(interaction.user.id)
    if(!canWatch)
        return handleError(`You cannot watch. Please make sure your limit of ${process.env.MAX_WATCHES} is not exceeded.`, interaction)

    const appId = interaction.options.getString('appid')
    if(!appId)
        return handleError('Invalid parameter.', interaction)

    // Get news to check if it's possible
    const news = await getNewsForApp(appId, 5)
        .catch(err => handleError(err, interaction))
    if(!news?.count)
        return handleError('Make sure appid is correct.', interaction)

    const regex = new RegExp(STEAM_APP_ID_REGEX)
    
    if(!regex.test(appId))
        return handleError('Invalid parameter.', interaction)

    addNotificationSubscriber(interaction, appId, 'news')
        .then(() => interaction.editReply('SUCCESS'))
        .catch(err => {
            handleError('Database error.', interaction)
            console.error(err)            
        }) 
}

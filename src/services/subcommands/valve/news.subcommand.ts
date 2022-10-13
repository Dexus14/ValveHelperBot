import { CommandInteraction } from "discord.js";
import { generateAndSendNewsEmbed } from "../../../embeds/valve.news.embed";
import { handleError } from "../../error.service";
import { getNewsForApp } from "../../valve.service";

export default async function (interaction: CommandInteraction) {
    const appid = interaction.options.getString('appid')

    const STEAM_ID_REGEX = new RegExp(/^[0-9]{1,30}$/g)

    if(!appid || !STEAM_ID_REGEX.test(appid))
        return handleError('Invalid userid.', interaction)

    const news = await getNewsForApp(appid, 5)
        .catch(err => handleError(err, interaction))
 
    if(!news?.count)
        return handleError('Error while getting news. Make sure appid is correct.', interaction)

    generateAndSendNewsEmbed(interaction, news.newsitems)
}

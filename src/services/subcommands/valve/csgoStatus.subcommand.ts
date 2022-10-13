import { CommandInteraction } from "discord.js";
import { generateAndSendCsgoStatusEmbed } from "../../../embeds/valve.csgoStatuse.embed";
import { handleError } from "../../error.service";
import { getCsgoStatus } from "../../valve.service";

export default async function (interaction: CommandInteraction) {
    const statuses = await getCsgoStatus()
        .catch(err => handleError(err, interaction))
 
    if(!statuses)
        return handleError('Error while getting statuses.', interaction)

    generateAndSendCsgoStatusEmbed(interaction, statuses)
}

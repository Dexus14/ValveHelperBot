import { CommandInteraction } from "discord.js";
import { generateAndSendProfileEmbed } from "../../../embeds/valve.profile.embed";
import { handleError } from "../../error.service";
import { resolveVanityUrl } from "../../valve.service";

export default async function(interaction: CommandInteraction) {
    const userid = interaction.options.getString('userid')    

    if(!userid)
        return handleError('No user ID!', interaction)

    const resolvedId = await resolveVanityUrl(userid)    

    if(!resolvedId)
        return handleError('Invalid user ID.', interaction)

    await generateAndSendProfileEmbed(interaction, resolvedId)
}

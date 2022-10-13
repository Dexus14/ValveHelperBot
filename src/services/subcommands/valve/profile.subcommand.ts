import { CommandInteraction } from "discord.js";
import { generateAndSendProfileEmbed } from "../../../embeds/valve.profile.embed";
import { handleError } from "../../error.service";
import { resolveVanityUrl } from "../../valve.service";

export default async function(interaction: CommandInteraction) {
    const userid = interaction.options.getString('userid')    

    if(!userid) return console.error('No user ID!', interaction) // FIXME: Is it correct way to handle error?

    const resolvedId = await resolveVanityUrl(userid)    

    if(!resolvedId) return handleError('Invalid user ID.', interaction)  

    generateAndSendProfileEmbed(interaction, resolvedId)
}

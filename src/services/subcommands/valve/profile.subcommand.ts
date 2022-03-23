import { CommandInteraction } from "discord.js";
import { generateAndSendProfileEmbed } from "../../../embeds/valve.profile.embed";
import { resolveVanityUrl } from "../../valve.service";

export default async function(interaction: CommandInteraction) {
    const userid = interaction.options.getString('userid')    

    if(!userid) return console.error('profile.subcommand.ts') // TODO: Handle error

    const resolvedId = await resolveVanityUrl(userid)    

    if(!resolvedId) return console.error('no resolved profile.subcommand.ts') // TODO: Handle error    

    generateAndSendProfileEmbed(interaction, resolvedId)
}
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { handleError } from "../../services/error.service";

export async function handleCommandStaticEmbed(interaction: CommandInteraction, embed: MessageEmbed) { //TODO: This has to be async?
    return interaction.editReply({ 
        embeds: [embed]
    })
}

export async function handleStaticEmbed(client: Client, channelId: string, embed: MessageEmbed) {
    const channel = await client.channels.fetch(channelId)

    if(!channel || !channel.isText()) return handleError('Invalid channel.')
    
    return channel.send({ embeds: [embed] })
}

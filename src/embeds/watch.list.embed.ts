import { CommandInteraction, MessageEmbed } from "discord.js";
import { IIntervalNotificationSubscriber } from "../models/IntervalNotificationSubscriber";
import { handleCommandStaticEmbed } from "./templates/static.embed";

export async function generateAndSendWatchListEmbed(
    userEntries: IIntervalNotificationSubscriber[], 
    channelEntries: IIntervalNotificationSubscriber[],
    interaction: CommandInteraction
    ) {
    const embed = await genrateWatchListEmbed(userEntries, channelEntries, interaction)
    handleCommandStaticEmbed(interaction, embed)
}

async function genrateWatchListEmbed(
    userEntries: IIntervalNotificationSubscriber[], 
    channelEntries: IIntervalNotificationSubscriber[],
    interaction: CommandInteraction
    ) {
    let content = '**Your entries:**\n'

    let index = 1
    for(const entry of userEntries) {
        const channel = await interaction.client.channels.fetch(entry.channelId)
        const channelName = channel?.toString() || channel?.id || 'channel not found'
        content += `${index}. ${entry.id} - ${entry.info} - ${channelName} - ${entry.type}\n`
        index++
    }

    content += '\n**Channel entries:**\n'

    for(const entry of channelEntries) {
        const channel = await interaction.client.channels.fetch(entry.channelId)
        const channelName = channel?.toString() || channel?.id || 'channel not found'
        content += `${index}. ${entry.id} - ${entry.info} - ${channelName} - ${entry.type}\n`
        index++
    }

    return new MessageEmbed()
        .setTitle('Your watch subscriptions')
        .setDescription(content)
        .setTimestamp()
}

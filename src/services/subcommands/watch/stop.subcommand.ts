import { CommandInteraction } from "discord.js";
import IntervalNotificationSubscriber from "../../../models/IntervalNotificationSubscriber";

export default async function stopWatch(interaction: CommandInteraction) {
    const id = interaction.options.getString('id')

    const subscription = await IntervalNotificationSubscriber.findOneAndDelete({ id })

    if(subscription) {
        const { channelId } = subscription
        const channel = await interaction.client.channels.fetch(channelId)
        const channelName = channel?.toString() || channelId || 'unknown channel'
        
        interaction.editReply(`Removed subscription for ${subscription.info} on channel ${channelName}`)
    } else {
        interaction.editReply('Error while removing subscription.')
    }
}

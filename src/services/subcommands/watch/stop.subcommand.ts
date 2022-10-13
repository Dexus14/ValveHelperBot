import { CommandInteraction } from "discord.js";
import IntervalNotificationSubscriber from "../../../models/IntervalNotificationSubscriber";
import { Types } from 'mongoose'
import { handleError } from "../../error.service";

export default async function stopWatch(interaction: CommandInteraction) {
    const id = interaction.options.getString('id')

    if(id !== null && !Types.ObjectId.isValid(id))
        return handleError('Invalid id!', interaction)

    const subscription = await IntervalNotificationSubscriber.findByIdAndDelete(id)

    if(subscription) {
        const { channelId } = subscription
        const channel = await interaction.client.channels.fetch(channelId)
        const channelName = channel?.toString() || channelId || 'unknown channel'
        
        interaction.editReply(`Removed subscription for ${subscription.info} on channel ${channelName}`)
    } else {
        interaction.editReply('Error while removing subscription.')
    }
}

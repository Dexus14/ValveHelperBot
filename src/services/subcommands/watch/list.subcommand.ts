import { CommandInteraction } from "discord.js";
import { generateAndSendWatchListEmbed } from "../../../embeds/watch.list.embed";
import { IIntervalNotificationSubscriber } from "../../../models/IntervalNotificationSubscriber";
import { getChannelNotificationEntries, getUserNotificationEntries } from "../../interval.service";

export default async function list(interaction: CommandInteraction) {
    const userId = interaction.user.id
    const channelId = interaction.channel?.id

    const userEntries = await getUserNotificationEntries(userId)
    let channelEntries: IIntervalNotificationSubscriber[] = []    
    
    if(channelId) 
        channelEntries = await getChannelNotificationEntries(channelId)

    generateAndSendWatchListEmbed(userEntries, channelEntries, interaction)
}

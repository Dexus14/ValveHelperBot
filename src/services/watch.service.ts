import { CommandInteraction } from "discord.js"
import IntervalNotificationSubscriber from "../models/IntervalNotificationSubscriber"
import { handleError } from "./error.service"

const MAX_WATCHES = parseInt(process.env.MAX_WATCHES ?? '0')

export async function addNotificationSubscriber(interaction: CommandInteraction, info: any, type: string) {
    const channelId = interaction.channel?.id
    if(!channelId)
        return handleError('Unknown error.', interaction)

    const userId = interaction.user.id
    if(!userId)
        return handleError('Unknown error.', interaction)
    
    const subscriberExistence = await subscriberExists(type, channelId, info)

    if(subscriberExistence) {
        handleError('Already subscribed.', interaction)
        throw new Error('Error: subscriber exists!')
    }

    return new IntervalNotificationSubscriber({
        type,
        channelId,
        userId,
        info
    }).save()
}
export async function userCanWatch(userId: string) {
    const userWatches = await countUserWatches(userId)

    return userWatches < MAX_WATCHES;
}

async function subscriberExists(type: string, channelId: string, info: string) {
    return await IntervalNotificationSubscriber.exists({ type, channelId, info })
}

async function countUserWatches(userId: string)
{
    return await IntervalNotificationSubscriber.count({ userId })
}

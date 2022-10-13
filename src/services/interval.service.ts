import { Client, MessageEmbed } from "discord.js";
import { generateNewsEmbed } from "../embeds/valve.news.embed";
import { handleStaticEmbed } from "../embeds/templates/static.embed";
import IntervalLastNotification from "../models/IntervalLastNotification";
import IntervalNotificationSubscriber, { IIntervalNotificationSubscriber } from "../models/IntervalNotificationSubscriber";
import { getNewsForApp, getPlayerBans } from "./valve.service";
import { generateBansEmbed } from "../embeds/valve.bans.embed";
import { handleError } from "./error.service";

const INTERVAL_TIMEOUT = parseInt(process.env.INTERVAL_TIMEOUT ?? '30000')

export function registerIntervalFunctions(client: Client) {
    setTimeout(() => handleNewsInterval(client), INTERVAL_TIMEOUT)
    setTimeout(() => handleBansInterval(client), INTERVAL_TIMEOUT)
}

async function handleNewsInterval(client: Client) {
    const subscribers = await IntervalNotificationSubscriber.find({ type: 'news' })    

    const appIds = subscribers.map(subscriber => subscriber.info)
        .filter((x, i, a) => a.indexOf(x) == i) // Leave only unique entries
        
    await sendNewsNotifications(appIds, subscribers, client)
}

async function sendNewsNotifications(appIds: string[], subscribers: IIntervalNotificationSubscriber[], client: Client) {
    for(const appId of appIds) {
        const news = await getNewsForApp(appId, 1)
        const latestNewsId = news.newsitems[0].gid
        const appSubscribers = subscribers.filter(el => el.info === appId)

        let lastNotification = await IntervalLastNotification.findOne({ type: 'news', id: appId })        
                
        if(lastNotification && lastNotification.lastData === latestNewsId) return
    
        const embed = generateNewsEmbed(news.newsitems)
        sendNotifications(appSubscribers, client, embed[0])
        
        if(!lastNotification) 
            addLastNotification(appId, latestNewsId, 'news')// TODO: fix this - Dear past myself, what does that mean?
        else {
            lastNotification.lastData = latestNewsId
            lastNotification.save()
        }
    }
}

async function handleBansInterval(client: Client) {
    const subscribers = await IntervalNotificationSubscriber.find({ type: 'bans' }) 

    for(const subscriber of subscribers) {
        const { info } = subscriber
        const lastNotification = await IntervalLastNotification.findOne({ id: info })
        const playerBans = await getPlayerBans(info)

        if(!lastNotification) {
            addLastNotification(info, playerBans, 'bans')
            continue
        }

        const newBans = compareBanInfo(lastNotification.lastData, playerBans)
        if(!newBans.length) continue

        lastNotification.lastData = playerBans
        lastNotification.save()

        const embed = generateBansEmbed(newBans)
        sendNotifications([subscriber], client, embed)
    }
}

function compareBanInfo(oldInfo: any, newInfo: any) {
    const result = []

    if(oldInfo.CommunityBanned !== newInfo.CommunityBanned) 
        result.push({ 
            type: 'community', 
            oldValue: oldInfo.CommunityBanned, 
            newValue: newInfo.CommunityBanned 
        })
    
    if(oldInfo.VACBanned !== newInfo.VACBanned) 
        result.push({ 
            type: 'vac', 
            oldValue: oldInfo.VACBanned, 
            newValue: newInfo.VACBanned 
        })

    if(oldInfo.NumberOfGameBans !== newInfo.NumberOfGameBans) 
        result.push({ 
            type: 'game', 
            oldValue: oldInfo.NumberOfGameBans, 
            newValue: newInfo.NumberOfGameBans 
        })

    if(oldInfo.EconomyBan !== newInfo.EconomyBan) 
        result.push({ 
            type: 'game', 
            oldValue: oldInfo.EconomyBan, 
            newValue: newInfo.EconomyBan 
        })

    return result
}

function addLastNotification(id: string, lastData: string, type: string) {
    return new IntervalLastNotification({
        type,
        id,
        lastData
    }).save()
}

function sendNotifications(subscribers: IIntervalNotificationSubscriber[], client: Client, embed: MessageEmbed) {
    for(const subscriber of subscribers) {
        const { channelId } = subscriber
        const channel = client.channels.fetch(channelId)

        if(!channel) {
            IntervalNotificationSubscriber.remove(subscriber)
            handleError('sendNotifications - Channel not found')                    
            continue
        }

        handleStaticEmbed(client, channelId, embed)
    }
}

export function getUserNotificationEntries(userId: string) {
    return IntervalNotificationSubscriber.find({ userId }).sort({ info: 1, createdAt: 1 })
}

export function getChannelNotificationEntries(channelId: string) {
    return IntervalNotificationSubscriber.find({ channelId }).sort({ info: 1, createdAt: 1 })
}

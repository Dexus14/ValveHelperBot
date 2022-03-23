import axios from 'axios';
import { Method } from 'axios'

export const STEAM_USER_ID_REGEX = /^[0-9]{17}$/g
export const STEAM_APP_ID_REGEX = /^[0-9]{0,30}$/g
enum VaintyUrlTypes { INDIVIDUAL_PROFILE = 1, GROUP = 2, OFFICIAL_GAME_GROUP = 3 }

export async function getNewsForApp(appid: string|number, count: number = 1) { // FIXME: REmove async???
    return (await makeApiRequest('/ISteamNews/GetNewsForApp/v2/', 'GET', {
        appid,
        count
    })).data.appnews
}

export async function getPlayerBans(steamids: string) {
    const response = await makeApiRequest('/ISteamUser/GetPlayerBans/v1/', 'GET', {
        steamids
    })

    return response.data.players[0]
}

export async function resolveVanityUrl(vanityurl: string, url_type: VaintyUrlTypes = 1) { // FIXME: Remove async??
    const regex = new RegExp(STEAM_USER_ID_REGEX)
    if(vanityurl.startsWith('https://steamcommunity.com/profiles/'))
        vanityurl = vanityurl.replace('https://steamcommunity.com/profiles/', '')
    if(regex.test(vanityurl))
        return vanityurl
    if(vanityurl.startsWith('https://steamcommunity.com/id/'))
        vanityurl = vanityurl.replace('https://steamcommunity.com/id/', '')
    if(vanityurl.endsWith('/'))
        vanityurl = vanityurl.substring(0, vanityurl.length - 2)
    
    const response = await makeApiRequest('/ISteamUser/ResolveVanityURL/v1/', 'GET', {
        vanityurl,
        url_type
    })

    return response.data.response.steamid
}

export async function getServerStatuses() {
    const response = await makeApiRequest('ICSGOServers_730/GetGameServersStatus/v1/', 'GET')

    return response.data.result
}

export async function getPlayerSummary(steamid: string) {
    const response = await makeApiRequest('ISteamUser/GetPlayerSummaries/v2/', 'GET', {
        steamids: steamid
    })

    return response.data.response.players[0]
}

export async function getSteamLevel(steamid: string) {
    const response = await makeApiRequest('IPlayerService/GetSteamLevel/v1/', 'GET', {
        steamid
    })

    return response.data.response.player_level
}

export async function getFriendList(steamid: string) {
    const response = await makeApiRequest('ISteamUser/GetFriendList/v1/', 'GET', {
        steamid
    })

    return response.data.friendslist.friends
}

export async function getUserStatsForGame(steamid: string, appid: string) {
    const response = await makeApiRequest('ISteamUserStats/GetUserStatsForGame/v2/', 'GET', {
        steamid,
        appid
    })

    return response.data.playerstats.stats
}

function makeApiRequest(endpoint: string, method: Method, params: any = {}) { // TODO: add trycatch?
    const url = process.env.STEAM_API_URL + '/' + endpoint
    params.key = process.env.STEAM_API_KEY
    return axios.request({
        url,
        method,
        params
    })
}
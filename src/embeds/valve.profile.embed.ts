import { CommandInteraction, MessageEmbed } from "discord.js";
import { getPlayerBans, getPlayerSummary, getSteamLevel } from "../services/valve.service";
import { handleCommandPagedEmbed } from "./templates/page.embed";

export async function generateAndSendProfileEmbed(interaction: CommandInteraction, userid: string) {
    const pages = await generateProfileEmbed(userid)

    handleCommandPagedEmbed(interaction, pages)
}

export async function generateProfileEmbed(userid: string) {
    const pages = []

    pages.push(await generatePage1(userid))
    pages.push(await generatePage2(userid))

    return pages
}

async function generatePage1(userid: string) {
    const summary = getPlayerSummary(userid)
    const steamLevel = await getSteamLevel(userid)

    const { 
        steamid, 
        communityvisibilitystate, 
        profilestate, 
        personaname,
        commentpermission,
        profileurl,
        avatarfull,
        personastate,
        primaryclanid,
        timecreated,
        loccountrycode,
        locstatecode,
        loccityid,
        personastateflags
     } = await summary

     const creationDate = (new Date(timecreated * 1000)).toLocaleDateString()

     const description = `
     Nick: ${personaname}
     ID: ${steamid}
     Level: ${steamLevel}
     Community visibility: ${communityvisibilitystate}
     Profilestate: ${profilestate}
     Comment permission: ${commentpermission}
     Persona state: ${personastate}
     Primary clan: ${primaryclanid}
     Account created: ${creationDate}
     Country: ${loccountrycode}
     State: ${locstatecode}
     City: ${loccityid}
     Persona state flags: ${personastateflags}
     `
    
    const embed = new MessageEmbed()
        .setTitle(personaname)
        .setDescription(description)
        .setImage(avatarfull)
        .setURL(profileurl)

    return embed
}

async function generatePage2(userid: string) {
    const playerBans = getPlayerBans(userid)

    const {
        CommunityBanned,
        NumberOfVACBans,
        DaysSinceLastBan,
        NumberOfGameBans,
        EconomyBan
     } = await playerBans

     const description = `
     CommunityBan: ${CommunityBanned}
     VAC bans: ${NumberOfVACBans}
     Game bans: ${NumberOfGameBans}
     Economy ban: ${EconomyBan}
     Last banned: ${DaysSinceLastBan} days ago 
     `

     const embed = new MessageEmbed()
        .setDescription(description)

    return embed
}

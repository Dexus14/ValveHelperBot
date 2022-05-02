import { CommandInteraction, MessageEmbed } from "discord.js";
import { csgoStatuses } from "../services/valve.service";
import { handleCommandPagedEmbed } from "./templates/page.embed";

// TODO: Make this embed pretty.

export function generateAndSendCsgoStatusEmbed(interaction: CommandInteraction, statuses: csgoStatuses) {
    const pages = generateCsgoStatusEmbed(statuses)
    
    handleCommandPagedEmbed(interaction, pages)
}

export function generateCsgoStatusEmbed(statuses: any) {
    const firstPage = prepareFirstPage(statuses)
    const secondPage = prepareSecondPage(statuses)
    const thirdPage = prepareThirdPage(statuses)

    const pages = [
        firstPage,
        secondPage,
        thirdPage
    ]
            
    return pages
}

function prepareFirstPage(statuses: csgoStatuses) {
    let result = ''

    for(const [name, status] of Object.entries(statuses.datacenters)) {        
        result += `${name}: ${status.capacity} : ${status.load}\n`
    }

    return new MessageEmbed()
        .setTitle('Server status')
        .setDescription(result)
        .setTimestamp()
}

function prepareSecondPage(statuses: csgoStatuses) {
    let result = ''

    for(const [name, status] of Object.entries(statuses.matchmaking)) {        
        result += `${name}: ${status}\n`
    }

    return new MessageEmbed()
        .setTitle('CSGO matchmaking status')
        .setDescription(result)
        .setTimestamp()
}

function prepareThirdPage(statuses: csgoStatuses) { //FIXME: FIx types in prepare funcs
    let result = ''

    for(const [name, status] of Object.entries(statuses.services)) {        
        result += `${name}: ${status}\n`
    }

    return new MessageEmbed()
        .setTitle('Services status')
        .setDescription(result)
        .setTimestamp()
}

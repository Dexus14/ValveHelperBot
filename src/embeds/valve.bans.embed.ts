import { MessageEmbed } from "discord.js";

export function generateBansEmbed(bans: any) {
    // TODO: Title - get username, image get image
    const content = prepareContent(bans)

    return new MessageEmbed()
        .setTitle('title')
        .setDescription(content)
        // .setImage(image)
        .setTimestamp()
}

function prepareContent(bans: any) {
    let result = ''

    for(const ban of bans) {
        result += `${ban.type} - ${ban.oldValue} -> ${ban.newValue}`
    }

    return result
} 

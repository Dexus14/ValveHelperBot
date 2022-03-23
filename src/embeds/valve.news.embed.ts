import { CommandInteraction, MessageEmbed } from "discord.js";
import { handleCommandPagedEmbed } from "./templates/page.embed";
import { handleCommandStaticEmbed } from "./templates/static.embed";

// TODO: Parse this with an actual parser

export function generateAndSendNewsEmbed(interaction: CommandInteraction, news: any) {// FIXME: Change type any
    const pages = generateNewsEmbed(news)

    if(pages.length === 1) {
        handleCommandStaticEmbed(interaction, pages[0])
    } else {
        handleCommandPagedEmbed(interaction, pages)
    }
}

export function generateNewsEmbed(news: any) {
    const pages = []

    for(const newsitem of news) {
        const { title, date, url } = newsitem        
        let { contents } = newsitem
        
        const [preparedContents, image] = prepareContents(contents)    
                
        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(preparedContents)
            .setImage(image)
            .setTimestamp(date * 1000)
            .setURL(encodeURI(url))
 
        pages.push(embed)
    }

    return pages
}

function prepareContents(contents: string) {
    let preparedContents = replaceTags(contents)
    preparedContents = removeStuff(preparedContents)
    const image = getImageFromContent(contents)

    if(contents.length > 300) {
        preparedContents = preparedContents.substring(0, 300)
    }

    preparedContents += '...\n\n  **To read the entire article please follow the link.**'

    return [preparedContents, image]
}

function replaceTags(contents: string) {
    return contents.replace(/[[<][^<[]{0,}[>\]]/gi, '')
}

function getImageFromContent(contents: string) {
    let image = ''
    contents.replace(/(\{STEAM_CLAN_IMAGE\}?[^\s"[]+)/i, url => image = url)
    if(image) image = image.replace(/{STEAM_CLAN_IMAGE}/i, 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans')
    if(!image) {        
        contents.replace(/(<|\[)(img src="){1,}(https?:\/\/[^\s"]+)/, url => image = url)
        image.replace(/(https?:\/\/[^\s"]+)/, (url) => image = url)
    }
    return image
}

function removeStuff(contents: string) {
    return contents.replace(/(\{STEAM_CLAN_IMAGE\}?[^\s"[]+)/g, '')
}

import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, VoiceChannel } from 'discord.js'
import NodeCache from 'node-cache'
import PagesEmbedCacheRecord from '../../interfaces/pagesEmbedCacheRecord.interface'
import { handleError } from '../../services/error.service'

const PAGE_EMBED_TTL = Number(process.env.PAGE_EMBED_TTL)

const pageEmbedCache = new NodeCache()

// FIXME: Fix bug when only one page is present

const backButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Back',
    emoji: '⬅️',
    customId: 'back'
})

const forwardButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Forward',
    emoji: '➡️',
    customId: 'forward'
})

export async function handleCommandPagedEmbed(interaction: CommandInteraction, embeds: MessageEmbed[]) {
    const message = await sendInitialMessage(interaction, embeds)

    if(!(message instanceof Message)) return handleError('An unknown error has occured.', interaction)

    addEmbedsToCache(message, embeds)
    addPageButtonCollector(message, interaction.user.id)
}

function addPageButtonCollector(message: Message, authorId: string) {
    const collector = message.createMessageComponentCollector({ 
        filter: ({ user }) => user.id === authorId, 
        time: PAGE_EMBED_TTL * 1000,
    })

    collector.on('collect', interaction => {
        handleCollectedArrow(interaction)
    })

    collector.on('end', () => {
        message.delete()
    })
}

function sendInitialMessage(interaction: CommandInteraction, embeds: MessageEmbed[]) {
    let components: MessageButton[] = []
    if(embeds.length > 1) {
        components = [forwardButton]
    } 

    return interaction.editReply({ 
        embeds: [embeds[0]],
        components: [new MessageActionRow({ components })],
    })
}

function addEmbedsToCache(message: Message, embeds: MessageEmbed[]) {
    const { id } = message
    const cacheValue = {
        currentPage: 0,
        embeds
    }

    pageEmbedCache.set(id, cacheValue)
}

function handleCollectedArrow(interaction: MessageComponentInteraction) {
    if(!(interaction.message instanceof Message)) return handleError('No message to collect arrow.')
        
    const id = interaction.message.id
    const cacheValue = pageEmbedCache.get(id) as PagesEmbedCacheRecord | undefined

    if(!cacheValue) return handleError('No page embed in cache.')
    
    let { currentPage, embeds } = cacheValue

    if(interaction.customId === 'forward') currentPage++
    else if(interaction.customId === 'back') currentPage--

    let components = []

    if(currentPage === 0) 
        components = [forwardButton]
    else if(currentPage === embeds.length - 1) 
        components = [backButton]
    else 
        components = [backButton, forwardButton]

    interaction.update({ 
        embeds: [embeds[currentPage]],
        components: [new MessageActionRow({ components })]
    })

    pageEmbedCache.set(id, { currentPage, embeds })
}

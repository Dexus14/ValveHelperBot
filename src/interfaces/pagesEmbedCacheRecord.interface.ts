import { MessageEmbed } from "discord.js";

export default interface PagesEmbedCacheRecord {
    currentPage: number,
    embeds: MessageEmbed[]
}
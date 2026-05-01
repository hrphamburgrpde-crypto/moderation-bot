const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../data/guildSettings');

module.exports = async (client, guild, title, description, color = 0x2b2d31) => {

    try {
        const channelId = getLogChannel(guild.id);
        if (!channelId) return;

        const channel = await client.channels.fetch(channelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: `Logs | ${guild.name}` });

        await channel.send({ embeds: [embed] });

    } catch (err) {
        console.error("Logger Fehler:", err);
    }
};
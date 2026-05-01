const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const linkBlock = require('../../data/linkBlock');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link-block')
        .setDescription('Aktiviert oder deaktiviert Link Block'),

    async execute(interaction) {

        // 🔒 nur Admin Permission
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: "❌ Nur Admins können diesen Command nutzen.",
                ephemeral: true
            });
        }

        const current = linkBlock.get(interaction.guild.id);
        const newValue = !current;

        linkBlock.set(interaction.guild.id, newValue);

        // 📊 LOGGING
        await logger(
            interaction.client,
            interaction.guild,
            "🔗 Link-Block geändert",
            `👤 Von: ${interaction.user.tag}\n📌 Status: ${newValue ? "AKTIVIERT" : "DEAKTIVIERT"}`,
            0x3498db
        );

        await interaction.reply(
            `🔗 Link Block ist jetzt **${newValue ? "AKTIVIERT" : "DEAKTIVIERT"}**`
        );
    }
};
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const warns = require('../../data/warns');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Entfernt eine bestimmte Warn')
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('User von dem die Warn entfernt wird')
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName('id')
                .setDescription('Die Warn ID')
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "❌ Keine Rechte", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const id = interaction.options.getString('id');

        const success = warns.removeWarn(interaction.guild.id, user.id, id);

        if (!success) {
            return interaction.reply({
                content: "❌ Warn nicht gefunden.",
                ephemeral: true
            });
        }

        await interaction.reply("✅ Warn erfolgreich gelöscht.");
    }
};
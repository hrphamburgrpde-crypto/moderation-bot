const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setLogChannel } = require('../../data/guildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-log')
        .setDescription('Setzt den Log Channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Log Channel')
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: "❌ Nur Admins können das machen.",
                ephemeral: true
            });
        }

        const channel = interaction.options.getChannel('channel');

        setLogChannel(interaction.guild.id, channel.id);

        await interaction.reply(`📊 Log Channel gesetzt auf ${channel}`);
    }
};
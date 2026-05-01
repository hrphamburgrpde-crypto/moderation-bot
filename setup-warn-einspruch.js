const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setChannel } = require('../../data/warnConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-warn-einspruch')
        .setDescription('Setzt den Einspruch Channel')
        .addChannelOption(opt =>
            opt.setName('channel')
                .setDescription('Channel')
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "❌ Nur Admins!", ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        setChannel(interaction.guild.id, channel.id);

        await interaction.reply(`✅ Einspruch Channel gesetzt: ${channel}`);
    }
};
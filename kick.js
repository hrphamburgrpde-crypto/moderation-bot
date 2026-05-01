const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kickt einen User')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Grund')),

    async execute(interaction) {

        try {
            if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
                return interaction.reply({ content: "❌ Keine Berechtigung.", ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || "Kein Grund";

            const member = await interaction.guild.members.fetch(user.id);

            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({
                    content: "❌ Du kannst diesen User nicht kicken.",
                    ephemeral: true
                });
            }

            if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({
                    content: "❌ Ich kann diesen User nicht kicken.",
                    ephemeral: true
                });
            }

            await member.kick(reason);

            await interaction.reply(`👢 ${user.tag} wurde gekickt.`);

        } catch (err) {
            console.error(err);
            interaction.reply({ content: "❌ Fehler beim Kicken.", ephemeral: true });
        }
    }
};
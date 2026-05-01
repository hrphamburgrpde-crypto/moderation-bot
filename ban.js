const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannt einen User')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Grund')),

    async execute(interaction) {

        try {
            if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
                return interaction.reply({ content: "❌ Keine Berechtigung.", ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || "Kein Grund";

            const member = await interaction.guild.members.fetch(user.id);

            // 🔒 Role Hierarchy Check
            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({
                    content: "❌ Du kannst diesen User nicht bannen.",
                    ephemeral: true
                });
            }

            if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({
                    content: "❌ Ich kann diesen User nicht bannen.",
                    ephemeral: true
                });
            }

            await member.ban({ reason });

            await interaction.reply(`🔨 ${user.tag} wurde gebannt.`);

        } catch (err) {
            console.error(err);
            interaction.reply({ content: "❌ Fehler beim Bannen.", ephemeral: true });
        }
    }
};
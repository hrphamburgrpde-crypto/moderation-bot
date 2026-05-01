const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout für User')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Minuten')
                .setRequired(true)),

    async execute(interaction) {

        try {
            if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
                return interaction.reply({ content: "❌ Keine Berechtigung.", ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            const minutes = interaction.options.getInteger('minutes');

            const member = await interaction.guild.members.fetch(user.id);

            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({
                    content: "❌ Du kannst diesen User nicht timeouten.",
                    ephemeral: true
                });
            }

            if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({
                    content: "❌ Ich kann diesen User nicht timeouten.",
                    ephemeral: true
                });
            }

            await member.timeout(minutes * 60000, "Timeout via Bot");

            await interaction.reply(`⏱️ ${user.tag} wurde für ${minutes} Minuten getimeoutet.`);

        } catch (err) {
            console.error(err);
            interaction.reply({ content: "❌ Fehler beim Timeout.", ephemeral: true });
        }
    }
};
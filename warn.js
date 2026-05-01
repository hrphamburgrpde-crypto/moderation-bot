const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require('discord.js');

const warns = require('../../data/warns');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Verwarnt einen User')
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('User')
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName('reason')
                .setDescription('Grund')
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "❌ Keine Rechte", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const warn = warns.addWarn(
            interaction.guild.id,
            user.id,
            reason,
            interaction.user.tag
        );

        const embed = new EmbedBuilder()
            .setTitle("⚠️ Verwarnung")
            .setDescription(`Du wurdest auf **${interaction.guild.name}** verwarnt`)
            .addFields(
                { name: "Grund", value: reason },
                { name: "Warn ID", value: warn.id }
            )
            .setColor("Yellow");

        // 🔥 WICHTIG: Guild ID im Button!
        const button = new ButtonBuilder()
            .setCustomId(`appeal_${interaction.guild.id}_${user.id}_${warn.id}`)
            .setLabel("Einspruch einreichen")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        // DM senden
        await user.send({ embeds: [embed], components: [row] }).catch(() => {});

        await interaction.reply({
            content: `✅ ${user.tag} wurde verwarnt.`,
            ephemeral: true
        });
    }
};
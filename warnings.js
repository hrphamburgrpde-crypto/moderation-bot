const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const warns = require('../../data/warns');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Zeigt alle Warns eines Users')
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('User dessen Warns angezeigt werden')
                .setRequired(true)
        ),

    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const userWarns = warns.getWarns(interaction.guild.id, user.id);

        if (!userWarns.length) {
            return interaction.reply({
                content: `${user} hat keine Warns.`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📋 Warns von ${user.tag}`)
            .setColor("Orange");

        userWarns.forEach(w => {
            embed.addFields({
                name: `ID: ${w.id}`,
                value: `Grund: ${w.reason}\nMod: ${w.moderator}`
            });
        });

        await interaction.reply({ embeds: [embed] });
    }
};
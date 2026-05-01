const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

const { getChannel } = require('../data/warnConfig');
const warns = require('../data/warns');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        // BUTTONS
        if (interaction.isButton()) {

            if (interaction.customId.startsWith("appeal_")) {

                const modal = new ModalBuilder()
                    .setCustomId(interaction.customId)
                    .setTitle("Einspruch");

                const input = new TextInputBuilder()
                    .setCustomId("text")
                    .setLabel("Warum Einspruch?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(input)
                );

                return interaction.showModal(modal);
            }

            if (
                interaction.customId.startsWith("accept_") ||
                interaction.customId.startsWith("deny_")
            ) {

                const [type, guildId, userId, warnId] = interaction.customId.split("_");

                const user = await client.users.fetch(userId);

                const disabledRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("done")
                        .setLabel("Bearbeitet")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                );

                if (type === "accept") {

                    warns.removeWarn(guildId, userId, warnId);

                    await user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✅ Einspruch akzeptiert")
                                .setDescription("Dein Warn wurde entfernt.")
                                .setColor("Green")
                        ]
                    }).catch(() => {});

                    return interaction.update({
                        content: "✅ Akzeptiert",
                        components: [disabledRow]
                    });

                } else {

                    await user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("❌ Einspruch abgelehnt")
                                .setDescription("Dein Warn bleibt bestehen.")
                                .setColor("Red")
                        ]
                    }).catch(() => {});

                    return interaction.update({
                        content: "❌ Abgelehnt",
                        components: [disabledRow]
                    });
                }
            }
        }

        // MODAL
        if (interaction.isModalSubmit()) {

            if (interaction.customId.startsWith("appeal_")) {

                const [, guildId, userId, warnId] = interaction.customId.split("_");

                const channelId = getChannel(guildId);
                if (!channelId) {
                    return interaction.reply({
                        content: "❌ Kein Channel gesetzt!",
                        ephemeral: true
                    });
                }

                const channel = await client.channels.fetch(channelId);

                const text = interaction.fields.getTextInputValue("text");

                const embed = new EmbedBuilder()
                    .setTitle("📩 Einspruch")
                    .setDescription(`<@${userId}>`)
                    .addFields(
                        { name: "Warn ID", value: warnId },
                        { name: "Text", value: text }
                    );

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`accept_${guildId}_${userId}_${warnId}`)
                        .setLabel("Akzeptieren")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`deny_${guildId}_${userId}_${warnId}`)
                        .setLabel("Ablehnen")
                        .setStyle(ButtonStyle.Danger)
                );

                await channel.send({ embeds: [embed], components: [row] });

                return interaction.reply({
                    content: "✅ Einspruch gesendet!",
                    ephemeral: true
                });
            }
        }

        // COMMANDS
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);
            }
        }
    }
};
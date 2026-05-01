const logger = require('../utils/logger');

module.exports = {
    name: 'messageDelete',

    async execute(message, client) {
        if (!message.guild) return;

        const user = message.author?.tag || "Unbekannt (nicht im Cache)";
        const content = message.content || "Kein Inhalt (nicht im Cache)";

        await logger(
            client,
            message.guild,
            "🗑️ Nachricht gelöscht",
            `👤 User: ${user}\n💬 Inhalt: ${content}`,
            0xff0000
        );
    }
};
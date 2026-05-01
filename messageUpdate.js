const logger = require('../utils/logger');

module.exports = {
    name: 'messageUpdate',

    async execute(oldMessage, newMessage, client) {
        if (!oldMessage.guild) return;

        const oldContent = oldMessage.content || "leer";
        const newContent = newMessage.content || "leer";

        const user = oldMessage.author?.tag || "Unbekannt";

        // verhindert unnötige Logs (z.B. Embed Updates)
        if (oldContent === newContent) return;

        await logger(
            client,
            oldMessage.guild,
            "✏️ Nachricht bearbeitet",
            `👤 User: ${user}\n🕓 Alt: ${oldContent}\n🆕 Neu: ${newContent}`,
            0xffff00
        );
    }
};
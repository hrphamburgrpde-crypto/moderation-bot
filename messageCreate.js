const linkBlock = require('../data/linkBlock');

module.exports = {
    name: 'messageCreate',

    async execute(message, client) {

        try {
            if (message.author.bot) return;
            if (!message.guild) return;

            // 🔗 LINK BLOCK
            const enabled = linkBlock.get(message.guild.id);

            if (enabled) {
                const content = message.content.toLowerCase();

                const isLink =
                    content.includes("http://") ||
                    content.includes("https://") ||
                    content.includes("discord.gg") ||
                    content.includes("discord.com/invite");

                if (isLink) {
                    await message.delete().catch(() => {});

                    const warn = await message.channel.send(
                        `🚫 ${message.author}, Links sind deaktiviert!`
                    );

                    setTimeout(() => {
                        warn.delete().catch(() => {});
                    }, 5000);

                    return; // 🔥 verhindert weitere Ausführung
                }
            }

            // 🔥 PREFIX COMMANDS (!ping etc.)
            if (!message.content.startsWith('!')) return;

            const args = message.content.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.prefixCommands.get(commandName);
            if (!command) return;

            await command.execute(message, args, client);

        } catch (err) {
            console.error("messageCreate Fehler:", err);
        }
    }
};
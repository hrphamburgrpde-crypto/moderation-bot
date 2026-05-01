const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = async (client) => {

    const commands = [];
    const foldersPath = path.join(__dirname, '..', 'slashCommands');
    const folders = fs.readdirSync(foldersPath);

    for (const folder of folders) {

        const commandsPath = path.join(foldersPath, folder);
        const files = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of files) {

            const command = require(`../slashCommands/${folder}/${file}`);

            if (!command.data || !command.execute) {
                console.log(`❌ Fehlerhafte Command Datei: ${file}`);
                continue;
            }

            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log("🔄 Slash Commands werden registriert...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("✅ Slash Commands geladen.");
    } catch (error) {
        console.error(error);
    }
};
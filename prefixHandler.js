const fs = require('fs');

module.exports = (client) => {

    const files = fs.readdirSync('./src/prefixCommands');

    for (const file of files) {

        if (!file.endsWith('.js')) continue;

        const command = require(`../prefixCommands/${file}`);

        client.prefixCommands.set(command.name, command);
    }

    console.log("Prefix Commands geladen.");
};
require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const eventHandler = require('./handlers/eventHandler');
const slashHandler = require('./handlers/slashHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Collections
client.commands = new Collection();

// Ready Event (optional aber nice)
client.once('clientReady', () => {
    console.log(`✅ Online als ${client.user.tag}`);
});

// Handler laden
eventHandler(client);
slashHandler(client);

// Login
client.login(process.env.TOKEN);
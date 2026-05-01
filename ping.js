module.exports = {
    name: "ping",

    async execute(message, args, client) {

        const sent = await message.reply("🔴 Ping wird berechnet...");

        const latency = sent.createdTimestamp - message.createdTimestamp;

        const apiPing = client.ws.ping && client.ws.ping > 0
            ? client.ws.ping
            : 0;

        await sent.edit(
            `🤖 Aktueller Ping !\n📡 Bot Ping: ${apiPing}ms\n⏱️ Message Ping: ${latency}ms`
        );
    }
};
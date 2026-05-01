const settings = new Map();

module.exports = {
    setLogChannel(guildId, channelId) {
        settings.set(guildId, channelId);
    },

    getLogChannel(guildId) {
        return settings.get(guildId);
    }
};
const guildSettings = new Map();

module.exports = {
    set(guildId, value) {
        guildSettings.set(guildId, value);
    },

    get(guildId) {
        return guildSettings.get(guildId) || false;
    }
};
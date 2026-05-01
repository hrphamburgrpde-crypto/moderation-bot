const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'warns.json');

// Datei laden
function load() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(filePath));
}

// Datei speichern
function save(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Warn hinzufügen
function addWarn(guildId, userId, reason, moderator) {
    const data = load();

    if (!data[guildId]) data[guildId] = {};
    if (!data[guildId][userId]) data[guildId][userId] = [];

    const warn = {
        id: Date.now().toString(),
        reason,
        moderator,
        date: new Date().toISOString()
    };

    data[guildId][userId].push(warn);
    save(data);

    return warn;
}

// Warns holen
function getWarns(guildId, userId) {
    const data = load();
    return data[guildId]?.[userId] || [];
}

// EINZELNEN Warn löschen
function removeWarn(guildId, userId, warnId) {
    const data = load();

    if (!data[guildId] || !data[guildId][userId]) return;

    data[guildId][userId] = data[guildId][userId].filter(w => w.id !== warnId);

    save(data);
}

// ALLE Warns löschen
function clearWarns(guildId, userId) {
    const data = load();

    if (!data[guildId]) return;

    data[guildId][userId] = [];
    save(data);
}

module.exports = {
    addWarn,
    getWarns,
    removeWarn,
    clearWarns
};
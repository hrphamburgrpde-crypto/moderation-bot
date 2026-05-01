const { AuditLogEvent } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberUpdate',

    async execute(oldMember, newMember, client) {

        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        // Rolle hinzugefügt
        const addedRole = newRoles.find(role => !oldRoles.has(role.id));

        // Rolle entfernt
        const removedRole = oldRoles.find(role => !newRoles.has(role.id));

        if (!addedRole && !removedRole) return;

        const guild = newMember.guild;

        // Audit Logs holen (wer hat es gemacht?)
        const audit = await guild.fetchAuditLogs({
            limit: 1,
            type: addedRole
                ? AuditLogEvent.MemberRoleUpdate
                : AuditLogEvent.MemberRoleUpdate
        });

        const entry = audit.entries.first();
        const executor = entry?.executor;

        // ROLE ADDED
        if (addedRole) {
            return await logger(
                client,
                guild,
                "🎭 Rolle hinzugefügt",
                `👤 User: ${newMember.user.tag}\n🎭 Rolle: ${addedRole.name}\n🛡️ Von: ${executor?.tag || "Unbekannt"}`,
                0x2ecc71
            );
        }

        // ROLE REMOVED
        if (removedRole) {
            return await logger(
                client,
                guild,
                "🎭 Rolle entfernt",
                `👤 User: ${newMember.user.tag}\n🎭 Rolle: ${removedRole.name}\n🛡️ Von: ${executor?.tag || "Unbekannt"}`,
                0xe74c3c
            );
        }
    }
};
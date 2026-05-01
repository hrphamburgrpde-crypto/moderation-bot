const { AuditLogEvent } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberRemove',

    async execute(member, client) {

        const guild = member.guild;

        // Audit Logs holen
        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick
        });

        const kickLog = auditLogs.entries.first();

        const isKick =
            kickLog &&
            kickLog.target.id === member.id &&
            kickLog.createdTimestamp > Date.now() - 5000;

        if (isKick) {
            return await logger(
                client,
                guild,
                "👢 Member gekickt",
                `User: ${member.user.tag}\nModerator: ${kickLog.executor.tag}`,
                0xffa500
            );
        }

        // Ban prüfen
        const banLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd
        });

        const banLog = banLogs.entries.first();

        const isBan =
            banLog &&
            banLog.target.id === member.id &&
            banLog.createdTimestamp > Date.now() - 5000;

        if (isBan) {
            return await logger(
                client,
                guild,
                "🔨 Member gebannt",
                `User: ${member.user.tag}\nModerator: ${banLog.executor.tag}`,
                0xff0000
            );
        }

        // Normal Leave
        await logger(
            client,
            guild,
            "🚪 Member verlassen",
            `User: ${member.user.tag}`,
            0x95a5a6
        );
    }
};